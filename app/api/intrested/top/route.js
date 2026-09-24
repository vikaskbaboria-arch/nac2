import connectDB from "@/db";
import Interested from "@/models/intested";
import { NextResponse } from "next/server";

/**
 * Groups Interested records by movie, counts how many users marked
 * each one, and returns the most-interested titles.
 *
 * Assumes the Movie model's MongoDB collection is named "movies"
 * (mongoose's default, pluralized+lowercased from a model called
 * "Movie"). If your collection has a different name, change the
 * `from` field in the $lookup stage below to match.
 */
export const GET = async (req) => {
  try {
    await connectDB();

    const limit = Number(new URL(req.url).searchParams.get("limit")) || 12;

    const top = await Interested.aggregate([
      { $group: { _id: "$movie", count: { $sum: 1 }, type: { $first: "$type" } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movie",
        },
      },
      { $unwind: "$movie" },
      { $project: { _id: 0, movieid: "$movie.movieid", count: 1, type: 1 } },
    ]);

    return NextResponse.json({ top }, { status: 200 });
  } catch (err) {
    console.error("GET most-interested error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};