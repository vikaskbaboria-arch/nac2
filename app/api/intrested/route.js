import connectDB from "@/db";
import Movie from "@/models/movie.models";
import User from "@/models/user";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Interested from "@/models/intested";

export const POST = async (req) => {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // BUG FIX: req.json() returns a Promise — this was never awaited,
    // so `movieID` was always undefined.
    const body = await req.json();
    const { movieID, type } = body || {};
    const mid = movieID;

    if (!mid) {
      return NextResponse.json({ error: "movieID is required" }, { status: 400 });
    }
    if (!["movie", "series"].includes(type)) {
      return NextResponse.json(
        { error: 'type is required and must be "movie" or "series"' },
        { status: 400 }
      );
    }

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: "User does not exist" }, { status: 404 });
    }

    let currentMovie = await Movie.findOne({ movieid: mid });
    if (!currentMovie) {
      // BUG FIX: the created movie was never assigned back to
      // currentMovie, so currentMovie._id below was always crashing.
      currentMovie = await Movie.create({ movieid: mid });
    }

    const existingIntrested = await Interested.findOne({
      user: currentUser._id,
      movie: currentMovie._id,
    });
    if (existingIntrested) {
      return NextResponse.json({ error: "Already in watchlist" }, { status: 403 });
    }

    const intrest = await Interested.create({
      user: currentUser._id,
      movie: currentMovie._id,
      type,
    });

    return NextResponse.json({ intrest }, { status: 201 });
  } catch (error) {
    // BUG FIX: empty catch meant a failed request never got a response.
    console.error("POST interested error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

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

    const interested = await Interested.find({ user: user._id })
      .populate({ path: "movie", select: "movieid" })
      .lean();

    return NextResponse.json({ interested }, { status: 200 });
  } catch (err) {
    console.error("GET watchlist error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

export const DELETE = async (req) => {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const movieID = Number(body?.movieID);
    if (!Number.isInteger(movieID) || movieID <= 0) {
      return NextResponse.json({ error: "Valid movieID is required" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const movie = await Movie.findOne({ movieid: movieID });
    if (!movie) return NextResponse.json({ error: "Title not found" }, { status: 404 });

    const removed = await Interested.findOneAndDelete({ user: user._id, movie: movie._id });
    if (!removed) return NextResponse.json({ error: "Title is not in your interested list" }, { status: 404 });
    return NextResponse.json({ message: "Removed from interested list" });
  } catch (error) {
    console.error("DELETE interested error:", error);
    return NextResponse.json({ error: "Unable to update interested list" }, { status: 500 });
  }
};
