import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

import User from "@/models/userModel";

interface sendMialParams {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: sendMialParams) => {
  try {
    // TODO: CONFIGURE MAIL FOR USAGE
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: process.env.NODEMAILER_PORT,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });
    const verificationLink = `${process.env.DOMAIN}/verifyemail/?token=${hashedToken}`;
    const htmlModels = `Hi there, <br>
      click <a href="${verificationLink}">here</a> to 
      ${emailType === "VERIFY" ? "verify" : "reset your password"},<br>
      or copy and paset the below link in your browser.
      ${verificationLink}
      `; // html body
    const mailOptions = {
      from: "drumilhved@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "verification code" : "reset your password",

      html: htmlModels,
    };
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
