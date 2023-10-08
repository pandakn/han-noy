import mongoose, { Document, Schema, Types } from "mongoose";
import { RoomDocument } from "./rooms.model";
import { UserDocument } from "./users.model";

// Define the Menu type as you've done before
export interface IMenu {
    menu: Types.ObjectId;
    payers: Array<Types.ObjectId | UserDocument>;
    slip: string;
    price: number;
    amount: number; // price / len(payers)
}

// Define the BillDocument interface as you've done before
export interface BillDocument extends Document {
    menus: IMenu[];
    room: Types.ObjectId | RoomDocument;
    totalPrice: number;
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
                payers: [
                    {
                        type: Schema.Types.ObjectId,
                        ref: "User", // Reference the "User" model
                    },
                ],
                slip: {
                    type: String,
                },
                price: {
                    type: Number,
                },
                amount: {
                    type: Number,
                },
            },
        ],
        totalPrice: {
            type: Number,
        },
        room: {
            type: mongoose.Types.ObjectId,
            ref: "Room",
        },
    },
    { timestamps: true }
);

const Bill = mongoose.model<BillDocument>("Bill", billSchema);

export default Bill;
