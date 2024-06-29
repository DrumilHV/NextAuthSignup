import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    console.log("signup.ts->route\n", reqBody);
    const user = await User.findOne({ email });
    if (user) {
      NextResponse.json({ error: "User already exists !" }, { status: 400 });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    // create new user
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });
    //save to mongodb
    const savedUser = await newUser.save();
    console.log("saved user, signup.ts->route\n", savedUser);

    //send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
    return NextResponse.json(
      { message: "User saved successfully ", success: true, savedUser },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
