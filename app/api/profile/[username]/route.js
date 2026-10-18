import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import connectDB from "@/db";
import User from "@/models/user";
import Review from "@/models/review";
import Watchlist from "@/models/watchlist";
import Interested from "@/models/intested";
import UserCollectionGroup from "@/models/userCollectionGroup";
import { GENRES } from "@/lib/genres";

function isValidOptionalUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function serializeProfile(user) {
  return {
    id: String(user._id),
    username: user.username,
    name: user.name || user.username,
    profilepic: user.profilepic || "",
    coverpic: user.coverpic || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
    fav_genres: user.fav_genres || [],
    createdAt: user.createdAt,
  };
}

export async function GET(_request, { params }) {
  try {
    await connectDB();
    const { username } = await params;
    const user = await User.findOne({ username }).lean();
    if (!user) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const session = await getServerSession(authOptions);
    const currentUser = session?.user?.email
      ? await User.findOne({ email: session.user.email }).select("_id").lean()
      : null;
    const isOwner = Boolean(currentUser && String(currentUser._id) === String(user._id));
    const collectionFilter = { user: user._id, ...(isOwner ? {} : { isPrivate: false }) };

    const [reviewCount, collectionCount, watchlistCount, interestedCount] = await Promise.all([
      Review.countDocuments({ user: user._id }),
      UserCollectionGroup.countDocuments(collectionFilter),
      isOwner ? Watchlist.countDocuments({ user: user._id }) : Promise.resolve(null),
      isOwner ? Interested.countDocuments({ user: user._id }) : Promise.resolve(null),
    ]);

    return NextResponse.json({
      profile: serializeProfile(user),
      isOwner,
      stats: { reviews: reviewCount, collections: collectionCount, watchlist: watchlistCount, interested: interestedCount },
    });
  } catch (error) {
    console.error("GET /api/profile/[username] error:", error);
    return NextResponse.json({ error: "Unable to load profile" }, { status: 500 });
  }
}

export async function PATCH(_request, { params }) {
  try {
    await connectDB();
    const { username } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Sign in to edit your profile" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.username !== username) {
      return NextResponse.json({ error: "You can only edit your own profile" }, { status: 403 });
    }

    const body = await _request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Profile details are required" }, { status: 400 });
    }
    const fields = {
      name: { max: 50 },
      bio: { max: 280 },
      location: { max: 80 },
      website: { max: 200, url: true },
      profilepic: { max: 500, url: true },
      coverpic: { max: 500, url: true },
    };
    const update = {};
    for (const [field, rules] of Object.entries(fields)) {
      if (!(field in (body || {}))) continue;
      if (typeof body[field] !== "string") {
        return NextResponse.json({ error: `Invalid ${field}` }, { status: 400 });
      }
      const value = body[field].trim();
      if (value.length > rules.max || (rules.url && !isValidOptionalUrl(value))) {
        return NextResponse.json({ error: `Check the ${field} value and try again` }, { status: 400 });
      }
      update[field] = value;
    }

    if ("fav_genres" in (body || {})) {
      if (!Array.isArray(body.fav_genres) || body.fav_genres.length > 5) {
        return NextResponse.json({ error: "Choose up to five favorite genres" }, { status: 400 });
      }
      const validGenres = new Set(GENRES.map((genre) => genre.name));
      if (body.fav_genres.some((genre) => typeof genre !== "string" || !validGenres.has(genre))) {
        return NextResponse.json({ error: "Choose genres from the list" }, { status: 400 });
      }
      update.fav_genres = [...new Set(body.fav_genres)];
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, { $set: update }, {
      new: true,
      runValidators: true,
    }).lean();

    return NextResponse.json({ profile: serializeProfile(updatedUser) });
  } catch (error) {
    console.error("PATCH /api/profile/[username] error:", error);
    return NextResponse.json({ error: "Unable to save profile" }, { status: 500 });
  }
}
