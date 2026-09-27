import { NextResponse } from "next/server";
import { checkIsAdmin } from "@/lib/admin";
import connectDB from "@/db";
import NacCollection from "@/models/nacCollection";

export async function GET() {
  try {
    const { isAdmin } = await checkIsAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    await connectDB();
    const items = await NacCollection.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/admin/nac-collection error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { isAdmin, user } = await checkIsAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const {
      movieId,
      mediaType = "movie",
      title,
      poster_path = "",
      backdrop_path = "",
      vote_average = 0,
      release_date = "",
      genres = [],
      overview = "",
      tag = "NAC Vault",
      curatorNote = "",
    } = body;

    if (!movieId || !title) {
      return NextResponse.json(
        { error: "movieId and title are required" },
        { status: 400 }
      );
    }

    const existing = await NacCollection.findOne({ movieId, mediaType });
    if (existing) {
      return NextResponse.json(
        { error: `"${title}" is already in NAC Collection` },
        { status: 409 }
      );
    }

    const count = await NacCollection.countDocuments();

    const newItem = await NacCollection.create({
      movieId,
      mediaType,
      title,
      poster_path,
      backdrop_path,
      vote_average,
      release_date,
      genres,
      overview,
      tag: tag || "NAC Vault",
      curatorNote,
      order: count,
      addedBy: user?._id,
    });

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/nac-collection error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { isAdmin } = await checkIsAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();

    // Batch reorder support: { orderedIds: [id1, id2, ...] }
    if (Array.isArray(body.orderedIds)) {
      await Promise.all(
        body.orderedIds.map((id, index) =>
          NacCollection.findByIdAndUpdate(id, { order: index })
        )
      );
      const updated = await NacCollection.find({}).sort({ order: 1, createdAt: -1 });
      return NextResponse.json({ success: true, items: updated });
    }

    // Single item update: { id, tag, curatorNote, order }
    const { id, tag, curatorNote, order } = body;
    if (!id) {
      return NextResponse.json({ error: "Item id is required" }, { status: 400 });
    }

    const updateFields = {};
    if (typeof tag === "string") updateFields.tag = tag;
    if (typeof curatorNote === "string") updateFields.curatorNote = curatorNote;
    if (typeof order === "number") updateFields.order = order;

    const updatedItem = await NacCollection.findByIdAndUpdate(id, updateFields, { new: true });
    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error("PUT /api/admin/nac-collection error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { isAdmin } = await checkIsAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Item id is required" }, { status: 400 });
    }

    await NacCollection.findByIdAndDelete(id);

    // Resequence remaining
    const remaining = await NacCollection.find({}).sort({ order: 1, createdAt: -1 });
    await Promise.all(
      remaining.map((item, idx) =>
        NacCollection.findByIdAndUpdate(item._id, { order: idx })
      )
    );

    return NextResponse.json({ success: true, message: "Item removed from NAC Collection" });
  } catch (error) {
    console.error("DELETE /api/admin/nac-collection error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
