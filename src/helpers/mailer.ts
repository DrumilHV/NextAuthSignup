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
    const mailOptions = {
      from: "drumilhved@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "verification code" : "reset your password",

      html: `clicl<a href="${
        process.env.DOMAIN
      }/verifyemail/${hashedToken}">here</a> to 
      ${emailType === "VERIFY" ? "verify" : "reset your password"},
      or copy and paset the below link in your browser.
      ${process.env.DOMAIN}/verifyemail/${hashedToken}
      `, // html body
    };
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
