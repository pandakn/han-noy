import mongoose, { Schema, Document } from "mongoose";

export interface MenuDocument extends Document {
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const menuSchema: Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Menu = mongoose.model<MenuDocument>("Menu", menuSchema);

export default Menu;
