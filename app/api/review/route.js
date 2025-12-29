import connectDB from "@/db";
import Review from "@/models/review";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import Movie from "@/models/movie.models";
import User from "@/models/user";

const POST = async (req) => {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { movieid, movieId, reviewText, rating } = body || {};
    const mid = movieid ?? movieId;

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: "User does not exist" }, { status: 404 });
    }

    let currentMovie = await Movie.findOne({ movieid: mid });
    if (!currentMovie) {
      currentMovie = await Movie.create({ movieid: mid });
    }

    const existingReview = await Review.findOne({
      user: currentUser._id,
      movie: currentMovie._id,
    });
    if (existingReview) {
      return NextResponse.json({ error: "Review already exists" }, { status: 400 });
    }

    const rev = await Review.create({
      user: currentUser._id,
      movie: currentMovie._id,
      review: reviewText,
      rating: rating,
    });

    return NextResponse.json(rev, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

const GET = async (req) => {
  try {
    await connectDB();
    const url = new URL(req.url);
    const movieId = url.searchParams.get("movieId") || url.searchParams.get("movieid");
    if (!movieId) {
      return NextResponse.json({ error: "movieId required" }, { status: 400 });
    }

    const movie = await Movie.findOne({ movieid: Number(movieId) });
      if (!movie) {
        return NextResponse.json({ reviews: [], averageRating: null, count: 0 }, { status: 200 });
      }

    const reviews = await Review.find({ movie: movie._id })
      .populate("user", "username profilepic")
      .sort({ createdAt: -1 })
      .lean();

    const ratings = reviews
      .map((r) => (typeof r.rating === "number" ? r.rating : null))
      .filter((v) => v !== null);
    const count = ratings.length;
    const averageRating = count > 0 ? ratings.reduce((s, v) => s + v, 0) / count : null;

    return NextResponse.json({ reviews, averageRating, count }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

export { GET, POST };
