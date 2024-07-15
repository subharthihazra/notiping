import { NextFunction, Request, Response } from "express";
import { removeWSIdByEmail, userWSIds } from "../store";
import { v4 as uuidv4 } from "uuid";

export async function getwsid(req: Request, res: Response, next: NextFunction) {
  try {
    removeWSIdByEmail(req.user.email);

    const wsid = uuidv4();

    userWSIds.push({ email: req.user.email, name: req.user.name, wsid });

    res.status(201).json({ success: true, data: wsid, message: "generated" });
  } catch (err) {
    next(err);
  }
}
