import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    console.log("signup.ts->route\n", reqBody);
    const user = await User.findOne({ email });
    if (!user) {
      NextResponse.json({ error: "User does not exist !" }, { status: 400 });
    }
    console.log("api/login", user);
    const validPassowrd = await bcryptjs.compare(password, user.password);
    if (!validPassowrd) {
      NextResponse.json(
        { error: "Invalid mail or password !" },
        { status: 400 }
      );
    }
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });
    const response = NextResponse.json(
      { message: "Login successfull !", success: true },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
