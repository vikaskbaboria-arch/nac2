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

export async function GET(request) {
  try {
    await connectDB();
    const requestedUsername = new URL(request.url).searchParams.get("username");
    let owner;
    let canViewPrivate = false;

    if (requestedUsername) {
      owner = await User.findOne({ username: requestedUsername });
      if (!owner) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      const currentUser = await getCurrentUser();
      canViewPrivate = Boolean(currentUser && currentUser._id.equals(owner._id));
    } else {
      owner = await getCurrentUser();
      if (!owner) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
      }
      canViewPrivate = true;
    }

    const collectionFilter = { user: owner._id };
    if (!canViewPrivate) collectionFilter.isPrivate = false;
    const collections = await UserCollectionGroup.find(collectionFilter)
      .select("_id name isPrivate updatedAt")
      .sort({ updatedAt: -1 })
      .lean();
    const collectionIds = collections.map((collection) => collection._id);
    const items = await UserCollection.find({
      user: owner._id,
      collectionId: { $in: collectionIds },
    })
      .sort({ createdAt: -1 })
      .lean();
    const itemsByCollection = new Map();

    for (const item of items) {
      const key = String(item.collectionId);
      const collectionItems = itemsByCollection.get(key) || [];
      collectionItems.push(item);
      itemsByCollection.set(key, collectionItems);
    }

    return NextResponse.json({
      collections: collections.map((collection) => ({
        ...collection,
        items: itemsByCollection.get(String(collection._id)) || [],
      })),
    });
  } catch (error) {
    console.error("GET /api/user-collections error:", error);
    return NextResponse.json({ error: "Unable to load collections" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name || name.length > 60) {
      return NextResponse.json(
        { error: "Collection name must be between 1 and 60 characters" },
        { status: 400 }
      );
    }
    if (typeof body.isPrivate !== "boolean") {
      return NextResponse.json({ error: "Choose whether the collection is private" }, { status: 400 });
    }

    const collection = await UserCollectionGroup.create({
      user: user._id,
      name,
      nameKey: name.toLocaleLowerCase(),
      isPrivate: body.isPrivate,
    });
    return NextResponse.json({ collection }, { status: 201 });
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json({ error: "You already have a collection with that name" }, { status: 409 });
    }
    console.error("POST /api/user-collections error:", error);
    return NextResponse.json({ error: "Unable to create collection" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (
      !body.collectionId ||
      !mongoose.isValidObjectId(body.collectionId) ||
      !name ||
      name.length > 60 ||
      typeof body.isPrivate !== "boolean"
    ) {
      return NextResponse.json({ error: "Valid collection details are required" }, { status: 400 });
    }

    const collection = await UserCollectionGroup.findOneAndUpdate(
      { _id: body.collectionId, user: user._id },
      { name, nameKey: name.toLocaleLowerCase(), isPrivate: body.isPrivate },
      { new: true, runValidators: true }
    );
    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
    return NextResponse.json({ collection });
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json({ error: "You already have a collection with that name" }, { status: 409 });
    }
    console.error("PATCH /api/user-collections error:", error);
    return NextResponse.json({ error: "Unable to update collection" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const collectionId = new URL(request.url).searchParams.get("collectionId");
    if (!collectionId || !mongoose.isValidObjectId(collectionId)) {
      return NextResponse.json({ error: "Valid collection ID is required" }, { status: 400 });
    }
    const collection = await UserCollectionGroup.findOneAndDelete({
      _id: collectionId,
      user: user._id,
    });
    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
    await UserCollection.deleteMany({ user: user._id, collectionId: collection._id });
    return NextResponse.json({ message: "Collection deleted" });
  } catch (error) {
    console.error("DELETE /api/user-collections error:", error);
    return NextResponse.json({ error: "Unable to delete collection" }, { status: 500 });
  }
}
