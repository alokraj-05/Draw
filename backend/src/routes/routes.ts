import { Router } from "express";
import authRouter from "./auth.route"
import { requireAuth } from "../middleware/auth.middleware";
import fileRouter from "../controllers/data/file.controller"
import userRouter from "../controllers/data/user.controller"
import { validRefreshToken } from "../middleware/refreshToken.middleware";
const router = Router();


router.use("/auth",authRouter)
router.use("/user/files",requireAuth,validRefreshToken,fileRouter)
router.use("/user",requireAuth,validRefreshToken,userRouter)
export default router