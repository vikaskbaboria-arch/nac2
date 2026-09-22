import connectDB from "@/db";
import Review from "@/models/review";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import Movie from "@/models/movie.models";
import User from "@/models/user";



export const GET = async (req) => {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userid = session?.user?.id;
   

    

    const reviews = await Review.find({ user: userid })
      .populate("user", "username profilepic")
      .sort({ createdAt: -1 })
      .lean();

   

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
