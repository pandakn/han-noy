// remove this file

import { Request, Response } from "express";

export const hello = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    res.status(201).json(`Hello ${name ?? "World"}`);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
