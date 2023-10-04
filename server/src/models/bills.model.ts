import mongoose, { Document, Schema, Types } from "mongoose";
import { MenuDocument } from "./menus.model";
import { UserDocument } from "./users.model";

// Define the Menu type as you've done before
export interface IMenu {
  menu: Types.ObjectId | MenuDocument;
  payers: Types.ObjectId | UserDocument;
  price: number;
  amount: number; // price / len(payers)
}

// Define the BillDocument interface as you've done before
export interface BillDocument extends Document {
  menus: IMenu[];
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Create the billSchema
const billSchema: Schema<BillDocument> = new mongoose.Schema(
  {
    menus: [
      {
        menu: {
          type: Schema.Types.ObjectId,
          ref: "Menu", // Reference the "Menu" model
        },
        payers: {
          type: Schema.Types.ObjectId,
          ref: "User", // Reference the "User" model
        },
        price: {
          type: Number,
        },
        amount: {
          type: Number,
        },
      },
    ],
    amount: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Bill = mongoose.model<BillDocument>("Bill", billSchema);

export default Bill;
