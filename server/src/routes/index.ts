import express, { Router } from "express";
import usersRoute from "./users.route";
import menusRoute from "./menus.route";
import billsRoute from "./bills.route";
import roomsRoute from "./rooms.route";

const router = Router();

export default (): express.Router => {
  usersRoute(router);
  menusRoute(router);
  billsRoute(router);
  roomsRoute(router);

  return router;
};
