import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userotps from "../models/UserOtp.js";
import nodemailer from "nodemailer"
import "dotenv/config"

import users from "../models/auth.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  // secure:true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existinguser = await users.findOne({ email });
    if (existinguser) {
      return res.status(404).json({ message: "User already Exist." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await users.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: newUser, token });
  } catch (error) {
    res.status(500).json("Something went worng...");
  }
};

export const userSendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Please Enter Your Email" });
  }

  try {
    const presuer = await users.findOne({ email: email });

    if (presuer) {
      const OTP = Math.floor(100000 + Math.random() * 900000);

      // if email already present in UserOtp collections
      // just update the otp
      // no need to create a new UserOtp object
      // cause two emails will then be present in the above mentioned collections
      const existEmail = await userotps.findOne({ email: email });

      // console.log("Exist email in userSendOtp function - backend", existEmail);
      if (existEmail) {
        const updateData = await userotps.findByIdAndUpdate(
          { _id: existEmail._id },
          {
            otp: OTP,
          },
          { new: true }
        );
        await updateData.save();

        // sending mail to already present user in UserOtp collection
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Sending Eamil For Otp Validation",
          text: `OTP:- ${OTP}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("error", error);
            res.status(400).json({ message: "Email not sent - try again" });
          } else {
            console.log("Email sent", info.response);
            res.status(200).json({ message: "Email sent Successfully" });
          }
        });
      } else {
        await userotps.create({
          email,
          otp: OTP,
        });

        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Sending Eamil For Otp Validation",
          text: `OTP:- ${OTP}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("error", error);
            res.status(400).json({ message: "Email not send" });
          } else {
            console.log("Email sent", info.response);
            res.status(200).json({ message: "Email sent Successfully" });
          }
        });
      }
    } else {
      res.status(400).json({ message: "Email not registered" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const login = async (req, res) => {
  const { email, otp } = req.body;
  console.log(email,otp)
  try {
    const existinguser = await users.findOne({ email });
    const otpverification = await userotps.findOne({ email });
    if (!existinguser) {
      return res.status(404).json({ message: "User don't Exist." });
    }
    if (!otpverification) {
      return res.status(400).json({ message: "Email not registered" });
    }
    const isOtpCrt = otpverification.otp === otp ? true : false;
    if (!isOtpCrt) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: existinguser.email, id: existinguser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: existinguser, token });
  } catch (error) {
    res.status(500).json("Something went worng...");
  }
};
