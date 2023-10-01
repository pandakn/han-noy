// remove this file
import express from "express";
import { hello } from "../controllers/hello.controller";

export default (r: express.Router) => {
  r.post("/hello", hello);
};
