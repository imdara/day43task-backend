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
        host: "smtp.mail.yahoo.com",
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
        html: `<b>Click on the link below to reset your password</b>
    <p>https://imdaras-day43task.netlify.app/reset?id=${userExist._id}</p>`, // html body
      });
      res.send("Mail sent successfully");
    }
  } catch (err) {
    console.log(err);
  }
};

export const passwordResetController = async (req, res) => {
  const { newPassword } = req.body;
  const _id = req.query.id;
  const salt = await bcrypt.genSalt();
  const hashedNewPassword = await bcrypt.hash(newPassword, salt);
  await User.findOneAndUpdate({ _id }, { password: hashedNewPassword });
  res.send("Password reset successful");
};
