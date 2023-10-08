import { generateAvatar } from "../utils/avatar";
import { RoomDocument } from "../models/rooms.model";
import User, { UserDocument } from "../models/users.model";

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
  const isUserInRoom = room.users.some((roomUser) => roomUser.equals(user._id));

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
