import { Request, Response } from "express";
import fs from "fs";
import mongoose from "mongoose";
import Bill, { BillDocument, IMenu } from "../models/bills.model";
import Menu, { MenuDocument } from "../models/menus.model";
import Room, { RoomDocument } from "../models/rooms.model";
import User, { UserDocument } from "../models/users.model";

export const addMenuIntoBill = async (req: Request, res: Response) => {
    try {
        const { billId } = req.params;
        const { menu, payerIds, price } = req.body;
        let { slip } = req.body;
        let menuId: mongoose.Types.ObjectId;
        const menuLowerCase = menu.toLowerCase();

        const bill: BillDocument | null = await Bill.findById({ _id: billId });

        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        // Find or create the menu
        let existingMenu: MenuDocument | null = await Menu.findOne({
            title: menuLowerCase,
        });

        if (!existingMenu) {
            const newMenu = new Menu({
                title: menuLowerCase,
                bills: [billId], // Add the bill ID to the menu's bills field
            });
            existingMenu = await newMenu.save();
        } else {
            // Check if the bill ID is already in the menu's bills field
            if (!existingMenu.bills.includes(bill._id)) {
                existingMenu.bills.push(bill._id); // Add the bill ID if not present
                await existingMenu.save();
            }
        }

        menuId = existingMenu._id;

        // Find users who are in the room
        const room: RoomDocument | null = await Room.findById(bill.room);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Find users who are in the room
        const usersInRoom: UserDocument[] = await User.find({
            _id: { $in: payerIds },
            rooms: {
                $elemMatch: { roomId: bill.room },
            },
        });

        if (usersInRoom.length !== payerIds.length) {
            return res.status(400).json({
                message: "Not all users are in the room",
            });
        }

        // Update the cover image to use the filename from multer
        if (req.file) {
            slip = req.file.filename;
        }

        // Calculate the amount (price divided by the number of payers)
        // round up
        const amountMenu = Math.ceil(price / usersInRoom.length);

        // Create the menu object
        const menuObj: IMenu = {
            menu: menuId,
            payers: usersInRoom.map((user) => user._id),
            slip,
            price,
            amount: amountMenu,
        };

        // Update the bill with the new menu and total price
        bill.menus.push(menuObj);
        bill.totalPrice += parseInt(price);
        await bill.save();

        // Update the users' amounts
        for (const user of usersInRoom) {
            user.rooms.find((room) => room.roomId.equals(bill.room._id)).amount += amountMenu;
            await user.save();
        }

        res.status(201).json({ bill });
    } catch (error) {
        console.error("Error add menu into bill:", error);
        res.status(500).json({
            message: "Error add menu into bill",
        });
    }
};

export const deleteMenuFromBill = async (req: Request, res: Response) => {
    try {
        const { billId, menuId } = req.params;

        const bill: BillDocument | null = await Bill.findById({ _id: billId });

        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        // Find the menu with the specified menuId in the bill's menus array
        const menuToDelete = bill.menus.find((menu) => menu.menu._id.equals(menuId));

        if (!menuToDelete) {
            return res.status(404).json({
                message: "Menu in bill not found",
            });
        }

        // Remove the menu from the bill's menus array
        bill.menus = bill.menus.filter((menu) => !menu.menu._id.equals(menuId));
        bill.totalPrice -= menuToDelete.price;

        // Remove the deleted menu's reference from the 'bills' field of the associated menu
        const associatedMenu: MenuDocument | null = await Menu.findById(menuId);
        if (associatedMenu) {
            associatedMenu.bills = associatedMenu.bills.filter((billRef) => !billRef.equals(billId));
            await associatedMenu.save();
        }

        // Remove the menu's amount from users in the room
        const usersInRoom: UserDocument[] = await User.find({
            _id: { $in: menuToDelete.payers },
            rooms: {
                $elemMatch: { roomId: bill.room },
            },
        });

        const amountToRemove = menuToDelete.amount;

        for (const user of usersInRoom) {
            const room = user.rooms.find((room) => room.roomId.equals(bill.room._id));
            if (room) {
                room.amount -= amountToRemove;
                await user.save();
            }
        }

        // remove slip
        if (menuToDelete.slip) {
            const imagePath = `public/images/slips/${menuToDelete.slip}`;
            fs.unlinkSync(imagePath);
        }

        // Save the updated bill
        await bill.save();

        res.status(204).end();
    } catch (error) {
        console.error("Error deleting menu from bill:", error);
        res.status(500).json({
            message: "Error deleting menu from bill",
        });
    }
};

export const addUserToPayers = async (req: Request, res: Response) => {
    try {
        const { billId, menuId } = req.params;
        const { userId } = req.body;

        const bill: BillDocument | null = await Bill.findById(billId);

        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        const menuToAddPayer = bill.menus.find((menu) => menu.menu._id.equals(menuId));

        if (!menuToAddPayer) {
            return res.status(404).json({ message: "Menu in bill not found" });
        }

        const user: UserDocument | null = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isUserInPayers = bill.menus.some((menu) => {
            if (menu.menu.equals(menuId)) {
                return menu.payers.includes(user._id);
            }
        });

        if (isUserInPayers) {
            return res.status(400).json({ message: "User is already in the list of payers" });
        }

        // Find the payers of the menuToAddPayer
        const payers = await User.find({
            _id: { $in: menuToAddPayer.payers },
        });

        // Calculate the new amountMenu
        const amountMenuOld = menuToAddPayer.amount;
        const amountMenuNew = Math.ceil(menuToAddPayer.price / (payers.length + 1));

        // Add the new payer to the menu
        menuToAddPayer.payers.push(user._id);
        menuToAddPayer.amount = amountMenuNew;

        // Update user's rooms
        for (const payer of payers) {
            payer.rooms.forEach((room) => {
                if (room.roomId.equals(bill.room._id)) {
                    // console.log(`before room amount ${payer.name}:`, room.amount);
                    room.amount += amountMenuNew - amountMenuOld;
                    // console.log(`after room amount ${payer.name}:`, room.amount);
                }
            });
        }

        // Update user's rooms
        user.rooms.forEach((room) => {
            if (room.roomId.equals(bill.room._id)) {
                room.amount += amountMenuNew;
            }
        });

        // Save the updated users and bill
        await Promise.all([user.save(), ...payers.map((payer) => payer.save()), bill.save()]);

        res.status(200).json({ message: "User added to the list of payers", bill });
    } catch (error) {
        console.error("Error adding user to payers:", error);
        res.status(500).json({ message: "Error adding user to payers" });
    }
};

export const removeUserFromPayers = async (req: Request, res: Response) => {
    try {
        const { billId, menuId } = req.params;
        const { userId } = req.body;

        const bill: BillDocument | null = await Bill.findById(billId);

        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        const menuToRemovePayer = bill.menus.find((menu) => menu.menu._id.equals(menuId));

        if (!menuToRemovePayer) {
            return res.status(404).json({ message: "Menu in bill not found" });
        }

        const user: UserDocument | null = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const payerIndex = menuToRemovePayer.payers.indexOf(userId);

        if (payerIndex === -1) {
            return res.status(400).json({ message: "User is not in the list of payers" });
        }

        // Calculate the new amountMenu
        const amountMenuOld = menuToRemovePayer.amount;
        const updatedPayersCount = menuToRemovePayer.payers.length - 1;
        const amountMenuNew = updatedPayersCount > 0 ? Math.ceil(menuToRemovePayer.price / updatedPayersCount) : 0;

        // Remove the payer from the menu
        menuToRemovePayer.payers.splice(payerIndex, 1);
        menuToRemovePayer.amount = amountMenuNew;

        // Find the payers of the menuToAddPayer
        const payers = await User.find({
            _id: { $in: menuToRemovePayer.payers },
        });

        // Update user's rooms
        for (const payer of payers) {
            payer.rooms.forEach((room) => {
                if (room.roomId.equals(bill.room._id)) {
                    room.amount += amountMenuNew - amountMenuOld;
                }
            });
        }

        // Update user's rooms
        user.rooms.forEach((room) => {
            if (room.roomId.equals(bill.room._id)) {
                room.amount -= amountMenuOld;
            }
        });

        // Save the updated user, menu, and bill
        await Promise.all([user.save(), bill.save()]);

        res.status(200).json({ message: "User removed from the list of payers", bill });
    } catch (error) {
        console.error("Error removing user from payers:", error);
        res.status(500).json({ message: "Error removing user from payers" });
    }
};
