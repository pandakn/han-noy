import { IBill } from "./bill.interface";
import { IUser } from "./user.interface";

export interface IRoom {
    _id: string;
    name: string;
    bio: string;
    qrCode: string;
    users: IUser[];
    bill: IBill;
    createdAt: string;
    updatedAt: string;
}

export interface RoomResponse {
    result: IRoom | IRoom[];
}
