import { Request, Response } from "express";
import Bill, { BillDocument } from "../models/bills.model";
import Room, { RoomDocument } from "../models/rooms.model";
import User, { UserDocument } from "../models/users.model";
import { generateQrCodePromptPay } from "../utils/promptPay";
import { generateAvatar } from "../utils/avatar";

export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const room = await Room.find()
      .populate("bill")
      .populate("users.user", "name avatar");

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
      .populate("bill")
      .populate("users.user", "name avatar");

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

    res
      .status(201)
      .json({ message: "Room created successfully", room: newRoom });
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

    // Get the users associated with the room
    const roomUsers: UserDocument[] = await User.find({
      _id: { $in: room.users.map((user) => user.user) },
    });

    // Remove the room's ObjectId from the users' rooms array
    roomUsers.forEach(async (user) => {
      user.rooms = user.rooms.filter(
        (userRoomId) => !userRoomId.equals(roomId)
      );
      await user.save();
    });

    // Delete the room using the deleteOne method
    await Room.deleteOne({ _id: roomId });

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

    // Check if the user exists
    let user: UserDocument | null = await User.findOne({ name: userName });

    if (!user) {
      // Create a new user if not found
      user = new User({
        name: userName,
        avatar: generateAvatar(userName), // Generate an avatar for the new user
      });
      await user.save();
    }

    // Check if the user is already in the room
    const isUserInRoom = room.users.some((roomUser) =>
      roomUser.user.equals(user._id)
    );

    if (isUserInRoom) {
      return res.status(400).json({ message: "User is already in the room" });
    }

    // Add the user to the room's users array
    room.users.push({ user: user.id, amount: 0 }); // You can set the initial amount as needed

    // Add the roomId to the user's rooms array
    user.rooms.push(room._id);

    // Save both the updated room and user documents
    await room.save();
    await user.save();

    res.status(200).json({ room });
  } catch (error) {
    console.error("Error adding user to room:", error);
    res.status(500).json({ message: "Error adding user to room" });
  }
};

export const removeUserFromRoom = async (req: Request, res: Response) => {
  try {
    const { roomId, userId } = req.params;

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

    // Remove the user from the room's users array
    room.users = room.users.filter(
      (roomUser) => !roomUser.user.equals(user._id)
    );

    // Remove the room's ObjectId from the user's rooms array
    user.rooms = user.rooms.filter(
      (userRoomId) => !userRoomId.equals(room._id)
    );

    // Save the updated room and user
    await Promise.all([room.save(), user.save()]);

    res
      .status(200)
      .json({ message: "User removed from the room successfully" });
  } catch (error) {
    console.error("Error removing user from room:", error);
    res.status(500).json({ message: "Error removing user from room" });
  }
};
