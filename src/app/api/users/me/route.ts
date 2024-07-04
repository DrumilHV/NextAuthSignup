import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select("-password");
    console.log(user);
    if (userId === undefined || !user) {
      return NextResponse.json(
        { message: "please login again!" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { message: "User found!", data: user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "error in login, please login again!" },
      { status: 400 }
    );
  }
}
