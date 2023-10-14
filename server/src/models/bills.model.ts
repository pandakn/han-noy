import mongoose, { Document, Schema, Types } from "mongoose";
import { UserDocument } from "./users.model";

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
            type: Schema.Types.ObjectId,
            ref: "Room",
        },
    },
    { timestamps: true }
);

const Bill = mongoose.model<BillDocument>("Bill", billSchema);

export default Bill;
