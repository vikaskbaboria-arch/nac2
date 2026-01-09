import User from "@/models/user";
import Movie from "@/models/movie.models";
import Watchlist from "@/models/watchlist";
import connectDB from "@/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/* ---------------- POST ---------------- */
export const POST = async (req) => {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const { movieid } = await req.json();
    if (!movieid || typeof movieid !== "number") {
      return NextResponse.json({ error: "Valid movieid required" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let movie = await Movie.findOne({ movieid });
    if (!movie) movie = await Movie.create({ movieid });

    const exists = await Watchlist.findOne({ user: user._id, movie: movie._id });
    if (exists) {
      return NextResponse.json({ error: "Already in watchlist" }, { status: 403 });
    }

    const watch = await Watchlist.create({
      user: user._id,
      movie: movie._id,
    });

    return NextResponse.json({ watch }, { status: 201 });
  } catch (err) {
    console.error("POST watchlist error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

/* ---------------- DELETE ---------------- */
export const DELETE = async (req) => {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }
    const { movieid } = await req.json();
    if (!movieid || typeof movieid !== "number") {
      return NextResponse.json({ error: "Valid movieid required" }, { status: 403 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const movie = await Movie.findOne({ movieid });
    if (!movie) {
      return NextResponse.json({ error: "Movie not found in watchlist" }, { status: 404 });
    }

    const deleted = await Watchlist.findOneAndDelete({
      user: user._id,
      movie: movie._id,
    });

    if (!deleted) {
      return NextResponse.json({ error: "Not in watchlist" }, { status: 400 });
    }

    return NextResponse.json({ message: "Removed from watchlist" }, { status: 200 });
  } catch (err) {
    console.error("DELETE watchlist error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

/* ---------------- GET ---------------- */
export const GET = async () => {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const watchlist = await Watchlist.find({ user: user._id })
      .populate({ path: "movie", select: "movieid" })
      .lean();

    return NextResponse.json({ watchlist }, { status: 200 });
  } catch (err) {
    console.error("GET watchlist error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
