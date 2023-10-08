import mongoose, { Document, ObjectId, Schema, Types } from "mongoose";
import { UserDocument } from "./users.model";

export interface RoomDocument extends Document {
  name: string;
  bio: string;
  users: Types.ObjectId[];
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
      unique: true,
    },
    bio: {
      type: String,
    },
    users: [{ type: mongoose.Types.ObjectId, ref: "User" }, { _id: false }],
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
