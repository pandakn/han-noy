import express from "express";
import {
  createUser,
  deleteUserById,
  updateUserById,
} from "../controllers/users.controller";

export default (r: express.Router) => {
  r.post("/users", createUser);
  r.put("/users/:id", updateUserById);
  r.delete("/users/:id", deleteUserById);
};
