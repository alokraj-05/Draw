import {Router} from "express"
import authController from "../controllers/auth/auth.controller"
const router = Router();

router.use("/",authController)

export default router;