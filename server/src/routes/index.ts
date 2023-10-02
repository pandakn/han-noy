import express, { Router } from "express";
import helloRoute from "./hello.route";
import usersRoute from "./users.route";

const router = Router();

export default (): express.Router => {
  helloRoute(router);
  usersRoute(router);

  return router;
};
