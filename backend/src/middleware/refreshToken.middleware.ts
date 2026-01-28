import { Response,NextFunction } from "express";
import { AuthUser } from "./auth.middleware";
import { getValidAccessToken } from "../services/googleClient";

export const validRefreshToken =  async (req:AuthUser,res:Response,next:NextFunction)=>{
  const {sub} = req.user;
  try {
    try {
      await getValidAccessToken(sub)
      next()
    } catch (error: any) {
      return res.status(401).json({message: error.message,redirectUrl: 'http://localhost:3334/api/auth/login-google'})
    }
  } catch (error:any) {
    console.log(error.message)
    return res.status(401).json({message: error?.message || 'internal server error'})
  }
}