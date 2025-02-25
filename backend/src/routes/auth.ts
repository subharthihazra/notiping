import { Express, Router } from "express";
import { signup, signin, isAuth, logout } from "../controllers/auth";
import {
  verifyUserMiddleware,
  isUserMiddleware,
} from "../validations/verifyUserMiddleware";
import { getwsid } from "../socket/socketid";

const router = Router();

router.post("/signup", isUserMiddleware, signup);
router.post("/signin", isUserMiddleware, signin);
router.post("/isauth", verifyUserMiddleware, isAuth);
router.post("/logout", verifyUserMiddleware, logout);
router.get("/wsid", verifyUserMiddleware, getwsid);

export default router;
