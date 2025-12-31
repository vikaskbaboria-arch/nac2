import connectDB from "@/db";
import Review from "@/models/review";
import Movie from "@/models/movie.models";
import { NextResponse } from "next/server";

// simple in-memory per-id cache
const cache = new Map(); // id -> { value, expires }
const TTL_MS = 60 * 1000; // 60s

const POST = async (req) => {
  try {
    await connectDB();
    const body = await req.json();
    const ids = Array.isArray(body?.ids) ? body.ids.map((i) => Number(i)) : [];
    if (!ids.length) return NextResponse.json({ ratings: {} }, { status: 200 });

    const now = Date.now();
    const result = {};
    const missing = [];

    // check cache first
    for (const id of ids) {
      const entry = cache.get(id);
      if (entry && entry.expires > now) {
        result[id] = entry.value;
      } else {
        missing.push(id);
      }
    }

    if (missing.length === 0) return NextResponse.json({ ratings: result }, { status: 200 });

    const movies = await Movie.find({ movieid: { $in: missing } }).lean();
    const movieMap = {};
    movies.forEach((m) => (movieMap[m.movieid] = m._id));

    const objectIds = Object.values(movieMap);
    let reviews = [];
    if (objectIds.length) {
      reviews = await Review.find({ movie: { $in: objectIds } }).lean();
    }

    // group ratings by movie object id
    const grouped = {};
    for (const r of reviews) {
      const key = String(r.movie);
      if (!grouped[key]) grouped[key] = [];
      if (typeof r.rating === "number") grouped[key].push(r.rating);
    }

    // compute per requested id
    for (const id of missing) {
      const objId = movieMap[id];
      if (!objId) {
        result[id] = null;
        cache.set(id, { value: null, expires: now + TTL_MS });
        continue;
      }
      const arr = grouped[String(objId)] || [];
      const avg = arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : null;
      result[id] = avg;
      cache.set(id, { value: avg, expires: now + TTL_MS });
    }

    return NextResponse.json({ ratings: result }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

export { POST };
