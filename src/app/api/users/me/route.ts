import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const user = User.findById({ userId }).select("-password");
    if (userId === undefined || !user) {
      return NextResponse.json(
        { message: "please login again!" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "error in login , please login again!" },
      { status: 400 }
    );
  }
}
