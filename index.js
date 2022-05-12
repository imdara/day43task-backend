import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "dotenv";
config();

//importing routes

import {
  loginRoute,
  signupRoute,
  forgotPasswordRoute,
  passwordResetRoute,
} from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 4000;

//middlewares
app.use(express.json());
app.use(cors());

// connecting to the database
mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
  .then(() => console.log("connected to the database"))
  .catch((err) => console.log(err));

app.get("/", (req, res) =>
  res.send({ status: 200, message: "Server working fine" })
);

// implementing routes
app.use("/login", loginRoute);
app.use("/signup", signupRoute);
app.use("/forgotpassword", forgotPasswordRoute);
app.use("/:id", passwordResetRoute);

app.listen(PORT, () => console.log("listening on port", PORT));
