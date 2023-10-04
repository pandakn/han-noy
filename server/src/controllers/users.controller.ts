import { Request, Response } from "express";
import User, { UserDocument } from "../models/users.model";

// utils
import { generateAvatar } from "../utils/avatar";

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    // Check if a user with the same name already exists
    const existingUser = await User.findOne({ name });

    if (existingUser) {
      res
        .status(400)
        .json({ message: "User with the same name already exists" });
      return;
    }

    const avatar = generateAvatar(name);

    const newUser: UserDocument = new User({
      name,
      avatar,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name } = req.body;

    // Find the user by ID
    const existingUser: UserDocument | null = await User.findById(userId);

    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if the new name is the same as the existing name
    if (name !== existingUser.name) {
      // If the new name is different, check if it's unique
      const userWithNewName: UserDocument | null = await User.findOne({ name });

      if (userWithNewName) {
        res
          .status(400)
          .json({ message: "User with the same name already exists" });
        return;
      }
    }

    // Update the user's name
    existingUser.name = name;
    existingUser.avatar = generateAvatar(name);

    // Save the updated user
    const updatedUser: UserDocument = await existingUser.save();

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Find the user by ID and remove it
    const deletedUser: UserDocument | null = await User.findByIdAndRemove(
      userId
    );

    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};
