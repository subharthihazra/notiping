import { Request } from "express";
import User from "./user";

export interface DataStoredInToken {
  _id: string;
  email: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
