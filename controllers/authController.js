import User from "../models/user.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const emailExist = await User.findOne({ email });
  if (!emailExist) {
    res.send(`${email} is not registered`);
  } else {
    const passwordCheck = await bcrypt.compare(password, emailExist.password);
    passwordCheck
      ? res.send("User logged in successfully")
      : res.send("Incorrect password");
  }
};

export const signupController = async (req, res) => {
  const { name, email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  await User.create({ name, email, password: hashedPassword });
  res.send("User signed up successfully");
};

export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      res.send(`${email} is not registered`);
    } else {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: process.env.USER_HOST,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.USER_ID, // generated ethereal user
          pass: process.env.USER_PASS, // generated ethereal password
        },
      });
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `"test" <${process.env.USER_ID}>`, // sender address
        to: `${email}`, // list of receivers
        subject: "Regarding password reset", // Subject line
        text: "follow the given link to reset your account password", // plain text body
        html: `<b>Copy the secret code below to reset your password</b>
    <p>${userExist._id}</p>`, // html body
      });
      res.send("Mail sent successfully");
    }
  } catch (err) {
    console.log(err);
  }
};

export const passwordResetController = async (req, res) => {
  const { secretCode, newPassword } = req.body;
  const _id = secretCode;
  const salt = await bcrypt.genSalt();
  const hashedNewPassword = await bcrypt.hash(newPassword, salt);
  const userExist = await User.findOneAndUpdate(
    { _id },
    { password: hashedNewPassword }
  );
  userExist
    ? res.send("Password reset successful")
    : res.send("User does not exist");
};
