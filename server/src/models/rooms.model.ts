import mongoose, { Document, Schema, Types } from "mongoose";
import { UserDocument } from "./users.model";
import { MenuDocument } from "./menus.model";

export interface RoomDocument extends Document {
  name: string;
  users: Array<{ user: Types.ObjectId | UserDocument; amount: number }>;
  menus: Array<{
    menu: Types.ObjectId | MenuDocument;
    payer: Types.ObjectId | UserDocument;
    price: number;
    amount: number;
  }>;
  qrCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    users: [
      {
        user: { type: mongoose.Types.ObjectId, ref: "User" },
        amount: Number, // sum amount from menus
      },
    ],
    menus: [
      {
        menu: { type: mongoose.Types.ObjectId, ref: "Menu" },
        payer: [{ type: mongoose.Types.ObjectId, ref: "User" }],
        price: Number,
        amount: Number, // price / len(payer)
      },
    ],
    qrCode: {
      type: String,
    },
  },
  { timestamps: true }
);

const Room = mongoose.model<RoomDocument>("Room", roomSchema);

export default Room;
