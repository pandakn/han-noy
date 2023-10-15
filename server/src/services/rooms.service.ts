import mongoose, { Types } from "mongoose";
import Menu, { MenuDocument } from "../models/menus.model";
import Room, { RoomDocument } from "../models/rooms.model";
import User, { UserDocument } from "../models/users.model";
import { generateAvatar } from "../utils/avatar";

// find room by id function
export const findRoomById = async (
    roomId: string
): Promise<RoomDocument | null> => {
    try {
        const room = await Room.findOne({ _id: roomId })
            .populate({
                path: "users",
            })
            .populate({
                path: "bill",
                select: "-room",
                populate: {
                    path: "menus.payers",
                },
            })
            .populate({
                path: "bill",
                populate: {
                    path: "menus.menu",
                    select: "title",
                },
            });

        return room;
    } catch (error) {
        console.error("Error getting room by ID:", error);
        throw new Error("Error getting room by ID");
    }
};

export async function findAllRooms(): Promise<RoomDocument[]> {
    try {
        const rooms: RoomDocument[] = await Room.find()
            .populate({
                path: "users",
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

        return rooms;
    } catch (error) {
        console.error("Error getting rooms:", error);
        throw new Error("Error getting rooms");
    }
}

export const addUserToRoom = async (
    room: RoomDocument,
    userName: string
): Promise<RoomDocument> => {
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
        roomUser.equals(user._id)
    );

    if (isUserInRoom) {
        throw new Error("User is already in the room");
    }

    // Add the user to the room's users array
    room.users.push(user.id); // You can set the initial amount as needed

    // Add the roomId to the user's rooms array
    user.rooms.push({ roomId: room._id, amount: 0 });

    // Save both the updated room and user documents
    await room.save();
    await user.save();

    return room;
};

export const removeBillFromMenus = async (billId: Types.ObjectId) => {
    try {
        const menus: MenuDocument[] = await Menu.find({ bills: billId });

        // Update each menu by removing the billId from its bills array
        for (const menu of menus) {
            const billIndex = menu.bills.indexOf(billId);
            if (billIndex !== -1) {
                menu.bills.splice(billIndex, 1);
                await menu.save();
            }
        }
    } catch (error) {
        console.error(`Error removing bill from menus: ${error}`);
    }
};
