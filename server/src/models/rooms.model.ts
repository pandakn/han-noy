import mongoose, { Document, ObjectId, Schema, Types } from "mongoose";
import { UserDocument } from "./users.model";

export interface IUser {
  user: Types.ObjectId | UserDocument;
  amount: number;
}

export interface RoomDocument extends Document {
  name: string;
  bio: string;
  users: IUser[];
  qrCode: string;
  bill: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    users: [
      {
        user: { type: mongoose.Types.ObjectId, ref: "User" },
        amount: Number, // sum amount from menus
      },
    ],
    qrCode: {
      type: String,
    },
    bill: {
      type: mongoose.Types.ObjectId,
      ref: "Bill",
    },
  },
  { timestamps: true }
);

const Room = mongoose.model<RoomDocument>("Room", roomSchema);

export default Room;
