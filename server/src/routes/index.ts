import express, { Router } from "express";
import helloRoute from "./hello.route";

const router = Router();

export default (): express.Router => {
  helloRoute(router);

  return router;
};
