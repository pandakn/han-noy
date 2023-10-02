import express from "express";
import {
  createMenu,
  deleteMenuById,
  getAllMenus,
  updateMenuById,
} from "../controllers/menus.controller";

export default (r: express.Router) => {
  r.get("/menus", getAllMenus);
  r.post("/menus", createMenu);
  r.put("/menus/:id", updateMenuById);
  r.delete("/menus/:id", deleteMenuById);
};
