import type { Request, Response } from "express";
import z from "zod";
import bcrypt from "bcrypt";

import User from "../db/schema/user";
import { generateToken, verifyToken } from "../utils/jwt";

const nameSchema = z
  .string()
  .min(2, { message: "Name must be at least 2 characters long" })
  .max(64, { message: "Name must be at most 64 characters long" })
  .regex(/^[a-zA-Z\s'-]+$/, {
    message: "Name can only contain letters, spaces, apostrophes, and hyphens",
  });

const signUpSchema = z.object({
  name: nameSchema,
  email: z
    .email("Invalid email")
    .max(64, "Email must be at max 64 characters long"),
  password: z
    .string()
    .min(8, "Password must be 8 characters long")
    .max(64, "Password must be at most 64 characters long"),
});

const salt = bcrypt.genSaltSync(10);

export async function signUp(req: Request, res: Response) {
  try {
    const result = signUpSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json(result.error);
    const userExists = await User.findOne({ email: result.data.email });
    if (userExists) return res.status(400).send("User already exists");
    const hashedPassword = bcrypt.hashSync(result.data.password, salt);

    const user = await User.create({
      name: result.data.name,
      email: result.data.email,
      password: hashedPassword,
    });

    return res.status(201).send({
      access_token: generateToken(user.email),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
}

async function checkAuthentication(token: string) {
  const payload = verifyToken(token);
  if (!payload) return false;
  return payload;
}

const loginSchema = z.object({
  email: z
    .email("Invalid email")
    .max(64, "Email must be at max 64 characters long"),
  password: z
    .string()
    .min(8, "Password must be 8 characters long")
    .max(64, "Password must be at most 64 characters long"),
});

export async function signIn(req: Request, res: Response) {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) return res.status(400).send(result.error);
    const { email, password } = result.data;

    const userExists = await User.findOne({ email: email });
    if (!userExists) return res.status(404).send("User not found");
    const validPassword = bcrypt.compareSync(password, userExists.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password");

    const accessToken = generateToken(userExists.email);
    return res.status(200).json({
      access_token: accessToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
}

export async function me(req: Request, res: Response) {
  try {
    const token = req.headers["x-access-token"];
    if (!token)
      return res
        .status(400)
        .send("x-access-token is missing in the http header");
    if (typeof token !== "string")
      return res.status(400).send("x-access-token must be a string");

    const payload = await checkAuthentication(token);
    console.log(payload);
    if (!payload) return res.status(400).send("User not loggedin");
    const user = await User.findOne({ email: payload }).select("-password");
    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
  //   const user = User.findById(req.user.id);
}
