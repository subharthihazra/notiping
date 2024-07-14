import { NextFunction, Request, Response } from "express";
import { sign } from "jsonwebtoken";
import userModel from "../models/users";
import { CustomError } from "../errorhandlers/CustomError";
import User from "../types/user";
import { JWT_SECRET_KEY } from "../config/env";
import { DataStoredInToken, TokenData } from "../types/token";

export async function signin(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user) {
      return next(new CustomError(400, "Already signed in"));
    }
    let { email, password }: { email: string; password: string } = req.body;
    if (!(email && password)) {
      return next(new CustomError(400, "Not enough data provided"));
    }
    const foundUser = await userModel.validateUserCredentials(email, password);
    if (!foundUser) {
      return next(new CustomError(401, "Invalid email or password"));
    }
    const tokenData = createToken(foundUser);
    const cookie = createCookie(tokenData);

    res.setHeader("Set-Cookie", [cookie]);
    res
      .status(201)
      .json({ success: true, data: foundUser, message: "loggedin" });
  } catch (err) {
    next(err);
  }
}

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user) {
      return next(new CustomError(400, "Already signed in"));
    }
    const {
      email,
      password,
      name,
    }: { email: string; password: string; name: string } = req.body;
    if (!(email && password && name)) {
      return next(new CustomError(400, "Not enough data provided"));
    }

    console.log("New User:", email);
    try {
      const createdUser: User = await userModel.create({
        email,
        password,
        name,
      });
      res.status(201).json({
        success: true,
        email: createdUser.email,
        name: createdUser.name,
      });
    } catch (err: any) {
      console.log("ERROR: ", err.code, err.name);
      if (err.name === "MongoServerError" && err.code === 11000) {
        return next(new CustomError(400, "Email is already used"));
      } else {
        return next(new CustomError(400, err.message));
      }
    }
  } catch (err) {
    next(err);
  }
}

export async function isAuth(req: Request, res: Response, next: NextFunction) {
  try {
    res
      .status(201)
      .json({ success: true, data: req.user, message: "authorized" });
  } catch (err) {
    next(err);
  }
}

function createToken(user: User): TokenData {
  // console.log(user);
  const dataStoredInToken: DataStoredInToken = {
    _id: user._id,
    email: user.email,
  };
  const secretKey: string = String(JWT_SECRET_KEY);
  const expiresIn: number = 14 * 24 * 60 * 60;

  return {
    expiresIn,
    token: sign(dataStoredInToken, secretKey, { expiresIn }),
  };
}

function createCookie(tokenData: TokenData): string {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; SameSite=None;  Secure`;
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const userData: User = req.user;
    if (!userData) {
      return next(new CustomError(400, "userData is empty"));
    }
    if (!(userData._id && userData.email)) {
      return next(new CustomError(400, "userData is empty"));
    }

    const foundUser = await userModel.findOne(
      {
        _id: userData._id,
        email: userData.email,
      },
      {
        _id: 1,
        email: 1,
      }
    );
    if (!foundUser) {
      throw new CustomError(409, `This email ${userData.email} was not found`);
    }

    res.setHeader("Set-Cookie", ["Authorization=; Max-age=0"]);
    res
      .status(200)
      .json({ success: true, data: foundUser, message: "loggedout" });
  } catch (error) {
    next(error);
  }
}
