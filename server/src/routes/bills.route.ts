import express from "express";
import {
    addMenuIntoBill,
    deleteMenuFromBill,
    addUserToPayers,
    removeUserFromPayers,
} from "../controllers/bills.controller";
import upload from "../middlewares/upload";

export default (r: express.Router) => {
    r.post("/bills/:billId/menu", upload.single("slip"), addMenuIntoBill);
    r.delete("/bills/:billId/menu/:menuId", deleteMenuFromBill);
    r.post("/bills/:billId/menu/:menuId/add-payer", addUserToPayers);
    r.delete("/bills/:billId/menu/:menuId/remove-payer", removeUserFromPayers);
};
