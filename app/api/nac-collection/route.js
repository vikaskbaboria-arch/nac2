import { NextResponse } from "next/server";
import connectDB from "@/db";
import NacCollection from "@/models/nacCollection";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag");
    const limit = parseInt(searchParams.get("limit") || "0", 10);

    const query = {};
    if (tag && tag !== "all") {
      query.tag = tag;
    }

    let mongoQuery = NacCollection.find(query).sort({ order: 1, createdAt: -1 }).lean();
    if (limit > 0) {
      mongoQuery = mongoQuery.limit(limit);
    }

    const items = await mongoQuery;
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/nac-collection error:", error);
    return NextResponse.json({ error: error.message, items: [] }, { status: 500 });
  }
}
