import mongoose, { Document, Schema, Types } from "mongoose";

interface IRoom {
    roomId: Types.ObjectId;
    amount: number;
}

export interface UserDocument extends Document {
    name: string;
    avatar: string;
    rooms: IRoom[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        avatar: {
            type: String,
        },
        rooms: [
            {
                roomId: {
                    type: mongoose.Types.ObjectId,
                    ref: "Room",
                },
                amount: {
                    type: Number,
                    default: 0,
                },
            },
        ],
    },
    { timestamps: true }
);

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
