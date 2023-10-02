import express, { Router } from "express";
import helloRoute from "./hello.route";
import usersRoute from "./users.route";
import menusRoute from "./menus.route";

const router = Router();

export default (): express.Router => {
  helloRoute(router);
  usersRoute(router);
  menusRoute(router);

  return router;
};
