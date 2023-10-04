import mongoose, { Document, Schema, Types } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  avatar: string;
  rooms: Types.ObjectId[];
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
        type: mongoose.Types.ObjectId,
      },
      { _id: false },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
