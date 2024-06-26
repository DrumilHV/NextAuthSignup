import nodemailer from "nodemailer";

interface sendMialParams {
  email: string;
  emailType: "VERIFY" | "RESET PASSWORD";
  userId: string;
}

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: sendMialParams) => {
  try {
    // TODO: CONFIGURE MAIL FOR USAGE
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "maddison53@ethereal.email",
        pass: "jn7jnAPss4f63QBp6D",
      },
    });
    const mailOptions = {
      from: "drumilhved@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "verification code" : "reset your password",

      html: `<b>Hello ${userId}</b>`, // html body
    };
    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
