import { NextFunction, Request, Response } from "express";
import { getWSIdByEmail, removeWSIdByEmail, userWSIds } from "../store";
import { v4 as uuidv4 } from "uuid";

export async function getwsid(req: Request, res: Response, next: NextFunction) {
  try {
    let user = getWSIdByEmail(req.user.email);
    // console.log(wsid,"hehr")
    let wsid;

    if (!user) {
      wsid = uuidv4();
      userWSIds.push({ email: req.user.email, name: req.user.name, wsid });
    } else {
      wsid = user.wsid;
    }

    res.status(201).json({ success: true, wsid: wsid, message: "generated" });
  } catch (err) {
    next(err);
  }
}
