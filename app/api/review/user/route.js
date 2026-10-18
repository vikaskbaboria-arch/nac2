import connectDB from "@/db";
import Review from "@/models/review";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import User from "@/models/user";



export const GET = async (req) => {
  try {
    await connectDB();
    const requestedUsername = new URL(req.url).searchParams.get("username");
    let profileUser;
    if (requestedUsername) {
      profileUser = await User.findOne({ username: requestedUsername }).select("_id");
      if (!profileUser) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    } else {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
      profileUser = await User.findOne({ email: session.user.email }).select("_id");
      if (!profileUser) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const reviews = await Review.find({ user: profileUser._id })
      .populate("user", "username profilepic")
      .populate("movie", "movieid media_type movieTitle moviePoster")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
