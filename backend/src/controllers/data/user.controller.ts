import type { Response } from "express";
import { Router } from "express";
import { AuthUser } from "../../middleware/auth.middleware";
import { getUser } from "../../services/user.service";

const router = Router();

router.get("/me",async (req: AuthUser,res:Response)=>{
  const { sub } = req.user;
  try {
    const user = await getUser(sub);
    res.status(200).send(user)
  } catch (error) {
    res.status(500).json({message: "Failed to update file"})
  } 
})

export default router;