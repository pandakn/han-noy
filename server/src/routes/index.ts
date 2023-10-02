import express, { Router } from "express";
import usersRoute from "./users.route";
import menusRoute from "./menus.route";

const router = Router();

export default (): express.Router => {
  usersRoute(router);
  menusRoute(router);

  return router;
};
