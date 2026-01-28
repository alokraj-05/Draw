import { Request,Response,Router } from "express";
import { getGoogleAuthUrl,getCode } from "../../services/auth.service";
import { requireAuth } from "../../middleware/auth.middleware";
import type { AuthUser } from "../../middleware/auth.middleware";
const router = Router();

router.get("/login-google",(req:Request,res:Response)=>{
  const url = getGoogleAuthUrl();
  return res.redirect(url);
})

router.get("/callback", async (req:Request,res:Response)=>{
  const {code} = req.query;

  if(!code){
    return res.status(400).json({message:"Missing code"})
  }
  // if code available exchange access token etc and setup session
  const successCode = await getCode(code as string)
  res.cookie("draw_",successCode,{
    maxAge: 30*24*60*60*1000,
    httpOnly:true,
    secure: true,
    sameSite:"lax",
  }).redirect("http://localhost:5173")
})

router.get("/me",requireAuth,(req:AuthUser,res:Response)=>{
  const {name,sub,picture} = req.user; 

  res.json({
    id: sub,
    name,
    picture
  })
})

router.get("/logout",async (req:Request,res:Response)=>{
  res.clearCookie("draw_").status(200).json({message:"Logout successfully"}).redirect("http://localhost:5173")
})

export default router;
// check redirect uri in gc