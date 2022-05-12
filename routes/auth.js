import { Router } from "express";
import {
  loginController,
  signupController,
  forgotPasswordController,
  passwordResetController,
} from "../controllers/authController.js";

export const loginRoute = Router().post("/", loginController);

export const signupRoute = Router().post("/", signupController);

export const forgotPasswordRoute = Router().post("/", forgotPasswordController);

export const passwordResetRoute = Router().post("/", passwordResetController);
