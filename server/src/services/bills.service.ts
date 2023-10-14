import Bill, { BillDocument, IMenuDocument } from "../models/bills.model";
import User, { UserDocument } from "../models/users.model";

export const findMenuInBill = async (billId: string, menuId: string) => {
    const bill = await Bill.findById(billId);
    if (!bill) return null;
    return bill.menus.find((menu) => menu.menu._id.equals(menuId)) || null;
};

export const findPayer = async (menu: IMenuDocument) => {
    const payers = await User.find({
        _id: { $in: menu.payers },
    });

    return payers;
};

export const updateUserAmount = (
    user: UserDocument,
    bill: BillDocument,
    amountDiff: number
) => {
    user.rooms.forEach((room) => {
        if (room.roomId.equals(bill.room._id)) {
            // console.log(`before room amount ${user.name}:`, room.amount);
            room.amount += amountDiff;
            // console.log(`after room amount ${user.name}:`, room.amount);
        }
    });
};
