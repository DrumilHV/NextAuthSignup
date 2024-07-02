import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function POST(request: NextRequest) {
  try {
    console.log("on verify mail");
    const reqBody = await request.json();
    const { token } = reqBody;
    console.log(token);
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
    console.log(user);
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    user.isVerified = true;
    await user.save();
    return NextResponse.json(
      { message: "email verified successfully!", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error in Verify email !", error);

    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
