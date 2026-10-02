import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import connectDB from "@/db";
import User from "@/models/user";
import UserCollection from "@/models/userCollection";
import UserCollectionGroup from "@/models/userCollectionGroup";

async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  return User.findOne({ email: session.user.email });
}

export async function POST(request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const movie = body?.movie;
    const movieId = Number(movie?.movieId);
    const mediaType = movie?.mediaType || "movie";
    if (
      !Number.isInteger(movieId) ||
      movieId <= 0 ||
      typeof movie?.title !== "string" ||
      !movie.title.trim() ||
      !["movie", "tv"].includes(mediaType)
    ) {
      return NextResponse.json({ error: "Valid movie details are required" }, { status: 400 });
    }

    let collection;
    if (body.collectionId && mongoose.isValidObjectId(body.collectionId)) {
      collection = await UserCollectionGroup.findOne({
        _id: body.collectionId,
        user: user._id,
      });
    } else if (typeof body.collectionName === "string") {
      const name = body.collectionName.trim();
      if (!name || name.length > 60 || typeof body.isPrivate !== "boolean") {
        return NextResponse.json(
          { error: "Collection name and visibility are required" },
          { status: 400 }
        );
      }
      const nameKey = name.toLocaleLowerCase();
      collection = await UserCollectionGroup.findOne({ user: user._id, nameKey });
      if (!collection) {
        try {
          collection = await UserCollectionGroup.create({
            user: user._id,
            name,
            nameKey,
            isPrivate: body.isPrivate,
          });
        } catch (error) {
          if (error?.code !== 11000) throw error;
          collection = await UserCollectionGroup.findOne({ user: user._id, nameKey });
        }
      }
    }

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    const entryFilter = {
      user: user._id,
      collectionId: collection._id,
      movieId,
      mediaType,
    };
    let entry = await UserCollection.findOne(entryFilter);
    if (!entry) {
      try {
        entry = await UserCollection.create({
          ...entryFilter,
          title: movie.title,
          poster_path: typeof movie.poster_path === "string" ? movie.poster_path : "",
          backdrop_path: typeof movie.backdrop_path === "string" ? movie.backdrop_path : "",
          vote_average: Number(movie.vote_average) || 0,
          release_date: typeof movie.release_date === "string" ? movie.release_date : "",
          genres: Array.isArray(movie.genres)
            ? movie.genres.filter((genre) => typeof genre === "string")
            : [],
          overview: typeof movie.overview === "string" ? movie.overview : "",
        });
      } catch (error) {
        if (error?.code !== 11000) throw error;
        entry = await UserCollection.findOne(entryFilter);
        if (!entry) throw error;
      }
    }

    return NextResponse.json({ entry, collection }, { status: 201 });
  } catch (error) {
    console.error("POST /api/user-collections/items error:", error);
    return NextResponse.json({ error: "Unable to add movie to collection" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.itemId || !mongoose.isValidObjectId(body.itemId)) {
      return NextResponse.json({ error: "Valid collection item ID is required" }, { status: 400 });
    }
    const removed = await UserCollection.findOneAndDelete({
      _id: body.itemId,
      user: user._id,
    });
    if (!removed) {
      return NextResponse.json({ error: "Collection item not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Movie removed from collection" });
  } catch (error) {
    console.error("DELETE /api/user-collections/items error:", error);
    return NextResponse.json({ error: "Unable to remove movie from collection" }, { status: 500 });
  }
}
