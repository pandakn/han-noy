import mongoose, { Document, Schema, Types } from "mongoose";

export interface MenuDocument extends Document {
  title: string;
  bills: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const menuSchema: Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
    },
    bills: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Bill",
      },
    ],
  },
  { timestamps: true }
);

const Menu = mongoose.model<MenuDocument>("Menu", menuSchema);

export default Menu;
