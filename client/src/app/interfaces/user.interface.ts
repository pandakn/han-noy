    interface Room {
        amount: number;
        _id: string;
    }

    export interface IUser {
        _id: string;
        name: string;
        avatar: string;
        rooms: Room[];
        createdAt: string;
        updatedAt: string;
    }
