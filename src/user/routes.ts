import express from "express";
import { me, signUp } from "./controller";

const userRouter = express.Router();

userRouter.route("/signup").post(signUp);
userRouter.route("/me").get(me);

export { userRouter };
