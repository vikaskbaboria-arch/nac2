import connectDB from "@/db";
import Watch from "@/models/watchlist";
import Movie from "@/models/movie.models";
import User from "@/models/user";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next"; // ✅ FIX
import { NextResponse } from "next/server";

/* ================= ADD TO WATCHLIST ================= */
export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { movieId } = await req.json();

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );
    }

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 }
      );
    }

    let currentMovie = await Movie.findOne({ movieid: movieId });
    if (!currentMovie) {
      currentMovie = await Movie.create({ movieid: movieId });
    }

    const existWatch = await Watch.findOne({
      user: currentUser._id,
      movie: currentMovie._id,
    });

    if (existWatch) {
      return NextResponse.json(
        { error: "Movie already exists in your watchlist" },
        { status: 400 }
      );
    }

    const watchList = await Watch.create({
      user: currentUser._id,
      movie: currentMovie._id,
    });

    return NextResponse.json(watchList, { status: 201 });
  } catch (error) {
    console.error("POST watchlist error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

/* ================= GET WATCHLIST ================= */
export async function GET(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions); // ✅ WORKS NOW
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 }
      );
    }

    const watchList = await Watch.find({ user: currentUser._id })
      .populate({
        path: "movie",
        select: "movieid createdAt",
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        count: watchList.length,
        watchList,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET watchlist error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
