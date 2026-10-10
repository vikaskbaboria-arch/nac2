import { NextResponse } from "next/server";
import connectDB from "@/db";
import UserCollection from "@/models/userCollection";
import UserCollectionGroup from "@/models/userCollectionGroup";

const PAGE_SIZE = 30;

export async function GET(request) {
  try {
    await connectDB();
    const requestedOffset = Number(
      new URL(request.url).searchParams.get("offset") || 0
    );
    const offset =
      Number.isInteger(requestedOffset) && requestedOffset >= 0
        ? requestedOffset
        : 0;

    const foundCollections = await UserCollectionGroup.find({ isPrivate: false })
      .select("_id user name updatedAt")
      .populate("user", "username name profilepic")
      .sort({ updatedAt: -1 })
      .skip(offset)
      .limit(PAGE_SIZE + 1)
      .lean();
    const hasMore = foundCollections.length > PAGE_SIZE;
    const collections = foundCollections.slice(0, PAGE_SIZE);

    if (collections.length === 0) {
      return NextResponse.json({ collections: [], hasMore: false });
    }

    const collectionFilters = collections
      .filter((collection) => collection.user)
      .map(({ _id, user }) => ({ collectionId: _id, user: user._id }));
    const [itemCounts, collectionsWithItems] = await Promise.all([
      collectionFilters.length
        ? UserCollection.aggregate([
            { $match: { $or: collectionFilters } },
            { $group: { _id: "$collectionId", itemCount: { $sum: 1 } } },
          ])
        : [],
      Promise.all(
        collections.map(async (collection) => ({
          id: String(collection._id),
          items: collection.user
            ? await UserCollection.find({
                collectionId: collection._id,
                user: collection.user._id,
              })
                .select("_id movieId mediaType title poster_path")
                .sort({ createdAt: -1 })
                .limit(8)
                .lean()
            : [],
        }))
      ),
    ]);
    const itemCountByCollection = new Map(
      itemCounts.map((entry) => [String(entry._id), entry.itemCount])
    );
    const itemsByCollection = new Map(
      collectionsWithItems.map((entry) => [entry.id, entry.items])
    );

    return NextResponse.json({
      hasMore,
      collections: collections.map((collection) => ({
        _id: collection._id,
        name: collection.name,
        updatedAt: collection.updatedAt,
        owner: {
          username: collection.user.username,
          name: collection.user.name,
          profilepic: collection.user.profilepic,
        },
        itemCount: itemCountByCollection.get(String(collection._id)) || 0,
        items: itemsByCollection.get(String(collection._id)) || [],
      })),
    });
  } catch (error) {
    console.error("GET /api/user-collections/public error:", error);
    return NextResponse.json(
      { error: "Unable to load public collections" },
      { status: 500 }
    );
  }
}
