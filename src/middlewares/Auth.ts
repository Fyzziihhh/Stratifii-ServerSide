// File: auth.ts

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createResponse } from "../helper/responseHandler";
import { HttpStatus } from "../config/HttpStatusCodes";
import Company, { ICompany } from "../models/company/Company";
import Interviewer, { IInterviewer } from "../models/interviewer/Interviewer";
import { Roles } from "../constants/roles";
import { Candidate } from "../models";

// Define an interface for the decoded token payload
export interface TokenPayload {
  userId: string;
  role: "admin" | "candidate" | "interviewer" | "company";
  exp?: number;
}

// Middleware to verify the token
export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log(req.url)
  //  console.log(token)
  if (!token) {
    return createResponse(
      res,
      HttpStatus.UNAUTHORIZED,
      false,
      "Access denied. No token provided."
    );
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as TokenPayload;

    if (!decoded) {
      return createResponse(
        res,
        HttpStatus.UNAUTHORIZED,
        false,
        "Invalid or expired token."
      );
    }
    // if(req.url!=="/profile"){
      
    //   const isUserVerified = await checkIsUserVerified(
    //     decoded.role,
    //     decoded.userId
    //   );
    //   if (!isUserVerified) {
    //     return createResponse(
    //       res,
    //       HttpStatus.FORBIDDEN,
    //       false,
    //       "Access Denied: Admin verification is required to proceed."
    //     );
    //   }
    // }
    req.user = decoded;
    next();
  } catch (err) {
    return createResponse(
      res,
      HttpStatus.UNAUTHORIZED,
      false,
      "Invalid or expired token."
    );
  }
}

const checkIsUserVerified = async (role: string, userId: string) => {
  let user: IInterviewer | ICompany | null = null;
  switch (role) {
    case Roles.COMPANY:
      user = await Company.findById(userId);
      break;
    case Roles.CANDIDATE:
      user = await Candidate.findById(userId);
      break;
    case Roles.INTERVIEWER:
      user = await Interviewer.findById(userId);
      break;
    default:
      user = null;
  }

  if (user && user.status !== "approved") {
    return false;
  } else return true;
};

// Middleware to check if the user has the required role
export function checkRole(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;
    if (userRole === requiredRole) {
      next();
    } else {
      createResponse(
        res,
        HttpStatus.FORBIDDEN,
        false,
        `Forbidden: ${requiredRole} access required.`
      );
    }
  };
}
