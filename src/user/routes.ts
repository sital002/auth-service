import express from "express";
import { me, signIn, signUp } from "./controller";

const userRouter = express.Router();

userRouter.route("/signup").post(signUp);
userRouter.route("/signin").post(signIn);
userRouter.route("/me").get(me);

export { userRouter };
