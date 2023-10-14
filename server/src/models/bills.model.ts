import mongoose, { Document, Schema, Types } from "mongoose";
import { UserDocument } from "./users.model";

// Define the IMenuDocument interface
export interface IMenuDocument extends Document {
    menu: Types.ObjectId;
    payers: Array<Types.ObjectId | UserDocument>;
    slip: string;
    price: number;
    amount: number; // price / len(payers)
}
export interface BillDocument extends Document {
    menus: IMenuDocument[];
    room: Types.ObjectId;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

// Define the Menu schema
const menuSchema = new Schema<IMenuDocument>({
    menu: {
        type: Schema.Types.ObjectId,
        ref: "Menu", // Reference to the "Menu" model
        required: true,
    },
    payers: [
        {
            type: Types.ObjectId,
            ref: "User", // Reference to the "User" model
        },
    ],
    slip: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    // You can set up a getter for the "amount" field to calculate it based on the number of payers
    amount: {
        type: Number,
    },
});

// Create the billSchema
const billSchema: Schema<BillDocument> = new mongoose.Schema(
    {
        menus: [menuSchema],
        totalPrice: {
            type: Number,
        },
        room: {
            type: Schema.Types.ObjectId,
            ref: "Room",
        },
    },
    { timestamps: true }
);

const Bill = mongoose.model<BillDocument>("Bill", billSchema);

export default Bill;
