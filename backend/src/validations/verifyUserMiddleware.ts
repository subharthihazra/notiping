import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import User from "../types/user";
import { JWT_SECRET_KEY } from "../config/env";
import { DataStoredInToken } from "../types/token";
import userModel from "../models/users";
import { CustomError } from "../errorhandlers/CustomError";

export async function verifyUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const Authorization =
      req.cookies["Authorization"] ||
      req.header("Authorization")?.split("Bearer ")[1];

    if (!Authorization) {
      return next(new CustomError(404, "Authentication token missing"));
    }
    const secretKey: string = String(JWT_SECRET_KEY);
    const verificationResponse = (await verify(
      Authorization,
      secretKey
    )) as DataStoredInToken;
    if (
      !(verificationResponse._id?.trim() && verificationResponse.email?.trim())
    ) {
      return next(new CustomError(401, "Wrong authentication token"));
    }
    const foundUser = await userModel.findOne(
      {
        _id: verificationResponse._id,
        email: verificationResponse.email,
      },
      {
        _id: 1,
        email: 1,
        name: 1,
      }
    );

    if (!foundUser) {
      return next(new CustomError(401, "Wrong authentication token"));
    }
    req.user = foundUser;
    next();
  } catch (error) {
    next(new CustomError(401, "Wrong authentication token"));
  }
}

export async function isUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const Authorization =
      req.cookies["Authorization"] ||
      req.header("Authorization")?.split("Bearer ")[1];

    if (!Authorization) {
      return next();
    }
    const secretKey: string = String(JWT_SECRET_KEY);
    const verificationResponse = (await verify(
      Authorization,
      secretKey
    )) as DataStoredInToken;
    if (
      !(verificationResponse._id?.trim() && verificationResponse.email?.trim())
    ) {
      return next(new CustomError(401, "Wrong authentication token"));
    }
    const foundUser = await userModel.findOne(
      {
        _id: verificationResponse._id,
        email: verificationResponse.email,
      },
      {
        _id: 1,
        email: 1,
        name: 1,
      }
    );

    if (!foundUser) {
      return next(new CustomError(401, "Wrong authentication token"));
    }
    req.user = foundUser;
    next();
  } catch (error) {
    next(new CustomError(401, "Wrong authentication token"));
  }
}
