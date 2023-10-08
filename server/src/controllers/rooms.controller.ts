import { Request, Response } from "express";
import Bill, { BillDocument } from "../models/bills.model";
import Room, { RoomDocument } from "../models/rooms.model";
import User, { UserDocument } from "../models/users.model";
import { addUserToRoom } from "../services/rooms.service";
import { generateQrCodePromptPay } from "../utils/promptPay";

export const getAllRooms = async (req: Request, res: Response) => {
    try {
        const room = await Room.find()
            .populate({
                path: "users",
                select: "-rooms.roomId", // Exclude the roomId field
            })
            .populate({
                path: "bill",
                populate: {
                    path: "menus.menu",
                    select: "title",
                },
            })
            .populate({
                path: "bill",
                select: "-room", // Exclude the room field
                populate: {
                    path: "menus.payers",
                },
            });

        res.status(200).json({ result: room });
    } catch (error) {
        console.error("Error getting room by ID:", error);
        res.status(500).json({ message: "Error getting room by ID" });
    }
};

export const getRoomById = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findOne({ _id: roomId })
            .populate({
                path: "users",
                select: "-rooms.roomId", // Exclude the roomId field
            })
            .populate({
                path: "bill",
                populate: {
                    path: "menus.menu",
                    select: "title",
                },
            })
            .populate({
                path: "bill",
                select: "-room", // Exclude the room field
                populate: {
                    path: "menus.payers",
                },
            });

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
            return res.status(400).json({ message: "Room name must be unique" });
        }

        // Create a new room
        const room = new Room({ name, bio, qrCode });
        const newRoom: RoomDocument = await room.save();

        // Create a corresponding bill for the room
        const bill = new Bill({ room: newRoom._id, menus: [], totalPrice: 0 });
        const newBill: BillDocument = await bill.save();

        // Update the room with the bill's ObjectId
        newRoom.bill = newBill._id;
        await newRoom.save();

        res.status(201).json({ message: "Room created successfully", room: newRoom });
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ message: "Error creating room" });
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
        }

        // Get the users associated with the room
        const roomUsers = room.users.map((user) => user);

        await Room.deleteOne({ _id: roomId });

        // remove the room from the users' rooms array
        await User.updateMany({ _id: { $in: roomUsers } }, { $pull: { rooms: roomId } });

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
        const room: RoomDocument | null = await Room.findById(roomId);

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

export const removeUserFromRoom = async (req: Request, res: Response) => {
    try {
        const { roomId, userId } = req.params;

        console.log(req.params);

        // Find the room by its ID
        const room: RoomDocument | null = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Find the user by their ID
        const user: UserDocument | null = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove the user's ID from the room's users array
        room.users = room.users.filter((roomUser) => !roomUser.equals(user._id));

        // Remove the room's ObjectId from the user's rooms array
        user.rooms = user.rooms.filter((userRoom) => !userRoom.roomId.equals(room._id));

        // Save the updated room and user
        await Promise.all([room.save(), user.save()]);

        res.status(200).json({ message: "User removed from the room successfully" });
    } catch (error) {
        console.error("Error removing user from room:", error);
        res.status(500).json({ message: "Error removing user from room" });
    }
};
