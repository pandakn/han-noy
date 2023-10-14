import express from "express";
import {
    addMenuIntoBill,
    deleteMenuFromBill,
    // addUserToPayers,
    addUsersToPayers,
    removeUserFromPayers,
    getBillById,
} from "../controllers/bills.controller";
import upload from "../middlewares/upload";

export default (r: express.Router) => {
    r.post("/bills/:billId/menu", upload.single("slip"), addMenuIntoBill);
    r.get("/bills/:billId", getBillById);
    r.delete("/bills/:billId/menu/:menuId", deleteMenuFromBill);
    // r.put("/bills/:billId/menu/:menuId/add-payer", addUserToPayers);
    r.put("/bills/:billId/menu/:menuId/add-payers", addUsersToPayers);
    r.delete("/bills/:billId/menu/:menuId/remove-payer", removeUserFromPayers);
};
