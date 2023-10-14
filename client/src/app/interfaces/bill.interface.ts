import { IUser } from "./user.interface";

export interface IMenu {
    _id: string;
    menu: {
        _id: string;
        title: string;
    };
    payers: IUser[];
    slip: string;
    price: number;
    amount: number;
}

export interface IBill {
    _id: string;
    menus: IMenu[];
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
}
