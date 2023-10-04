import express from "express";
import {
  createRoom,
  addUserIntoRoom,
  getRoomById,
  deleteRoomById,
  getAllRooms,
  removeUserFromRoom,
} from "../controllers/rooms.controller";

export default (r: express.Router) => {
  r.post("/rooms", createRoom);
  r.get("/rooms", getAllRooms);
  r.get("/rooms/:roomId", getRoomById);
  r.delete("/rooms/:roomId", deleteRoomById);

  r.post("/rooms/:roomId/user", addUserIntoRoom);
  r.delete("/rooms/:roomId/user/:userId", removeUserFromRoom);
};
