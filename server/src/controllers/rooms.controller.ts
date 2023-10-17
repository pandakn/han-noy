import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Bill, { BillDocument } from "../models/bills.model";
import Room, { RoomDocument } from "../models/rooms.model";
import User, { UserDocument } from "../models/users.model";
import {
    addUserToRoom,
    findAllRooms,
    findRoomById,
    removeBillFromMenus,
} from "../services/rooms.service";
import { generateQrCodePromptPay } from "../utils/promptPay";
import { findPayer, updateUserAmount } from "../services/bills.service";

export const getAllRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await findAllRooms();

        res.status(200).json({ result: rooms });
    } catch (error) {
        console.error("Error getting room by ID:", error);
        res.status(500).json({ message: "Error getting room by ID" });
    }
};

export const getRoomById = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const room = await findRoomById(roomId);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.status(200).json({ result: room });
    } catch (error) {
        console.error("Error getting room by ID:", error);
        res.status(500).json({ message: "Error getting room by ID" });
    }
};

export const createRoom = async (req: Request, res: Response) => {
    try {
        const { name, bio, promptPay } = req.body;
        const qrCode = generateQrCodePromptPay(promptPay);

        // Check if a room with the same name already exists
        const existingRoom = await Room.findOne({ name });

        if (existingRoom) {
            return res
                .status(400)
                .json({ message: "Room name must be unique" });
        }

        // Hash the prompt pay
        const salt = await bcrypt.genSalt(10);
        const hashedPromptPay = await bcrypt.hash(promptPay, salt);

        // Create a new room
        const room = new Room({
            name,
            bio,
            promptPay: hashedPromptPay,
            qrCode,
        });
        const newRoom: RoomDocument = await room.save();

        // Create a corresponding bill for the room
        const bill = new Bill({ room: newRoom._id, menus: [], totalPrice: 0 });
        const newBill: BillDocument = await bill.save();

        // Update the room with the bill's ObjectId
        newRoom.bill = newBill._id;
        await newRoom.save();

        res.status(201).json({
            message: "Room created successfully",
            room: newRoom,
        });
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ message: "Error creating room" });
    }
};

export const updateRoomById = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const { name, bio, promptPay } = req.body;

        const qrCode = generateQrCodePromptPay(promptPay);

        const room: RoomDocument | null = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Hash the prompt pay
        const salt = await bcrypt.genSalt(10);
        const hashedPromptPay = await bcrypt.hash(promptPay, salt);

        room.name = name;
        room.bio = bio;
        room.qrCode = qrCode;
        room.promptPay = hashedPromptPay;

        // Save the updated rooms
        const updatedRoom: RoomDocument = await room.save();
        res.status(200).json({
            message: "Room updated successfully",
            updatedRoom,
        });
    } catch (error) {
        console.error("Error updating room:", error);
        res.status(500).json({ message: "Error updating room" });
    }
};

export const deleteRoomById = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;

        const room: RoomDocument | null = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const bill = await Bill.findOne({ room: room._id });

        if (bill) {
            await bill.deleteOne();

            await removeBillFromMenus(bill._id);
        }

        // Get the users associated with the room
        const roomUsers = room.users.map((user) => user);

        await Room.deleteOne({ _id: roomId });

        // remove the room from the users' rooms array
        await User.updateMany(
            { _id: { $in: roomUsers } },
            { $pull: { rooms: { roomId: room._id } } }
        );

        res.status(204).end();
    } catch (error) {
        console.error("Error deleting room by ID:", error);
        res.status(500).json({ message: "Error deleting room by ID" });
    }
};

export const addUserIntoRoom = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const { userName } = req.body;

        // Check if the room exists
        const room = await findRoomById(roomId);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const updatedRoom = await addUserToRoom(room, userName);

        res.status(200).json({ room: updatedRoom });
    } catch (error) {
        console.error("Error adding user to room:", error);
        if (error.message === "User is already in the room") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Error adding user to room" });
    }
};

// remove from room -> remove from bill and new calculate -> remove room in user collection
export const removeUserFromRoom = async (req: Request, res: Response) => {
    try {
        const { roomId, userId } = req.params;

        // Find the room by its ID
        const room = await findRoomById(roomId);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Find the user by their ID
        const user: UserDocument | null = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the bill associated with the room
        const bill = await Bill.findOne({ room: room._id });

        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        // Find the menu that includes the user as a payer
        const menusToRemovePayer = bill.menus.filter((menu) =>
            menu.payers.includes(user._id)
        );

        // Remove the user as a payer from each menu and recalculate amounts
        for (const menuToRemovePayer of menusToRemovePayer) {
            menuToRemovePayer.payers = menuToRemovePayer.payers.filter(
                (payer) => !payer.equals(user._id)
            );

            const payersCount = menuToRemovePayer.payers.length;
            const oldMenuAmount = menuToRemovePayer.amount;
            const newMenuAmount =
                payersCount > 0
                    ? Math.ceil(menuToRemovePayer.price / payersCount)
                    : 0;
            menuToRemovePayer.amount = newMenuAmount;
            const payers = await findPayer(menuToRemovePayer);

            // update payers' amount
            // assume -> 334 + (312 - 234) = 412
            for (const payer of payers) {
                updateUserAmount(payer, bill, newMenuAmount - oldMenuAmount);
            }

            await Promise.all([...payers.map((payer) => payer.save())]);
        }

        // Remove the user's ID from the room's users array
        room.users = room.users.filter(
            (roomUser) => !roomUser.equals(user._id)
        );

        user.rooms = user.rooms.filter(
            (userRoom) => !userRoom.roomId.equals(room._id)
        );

        // console.log("bill: ", bill);
        // console.log("menuToRemovePayer new:", menusToRemovePayer);
        // console.log("user:", user);
        // console.log("room:", room);

        // Save the updated room and user
        await Promise.all([room.save(), bill.save(), user.save()]);

        res.status(200).json({
            message: "User removed from the room successfully",
        });
    } catch (error) {
        console.error("Error removing user from room:", error);
        res.status(500).json({ message: "Error removing user from room" });
    }
};
