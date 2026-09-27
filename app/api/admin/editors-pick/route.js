import { NextResponse } from "next/server";
import { checkIsAdmin } from "@/lib/admin";
import connectDB from "@/db";
import EditorsPick from "@/models/editorsPick";

export async function GET() {
  try {
    const { isAdmin } = await checkIsAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    await connectDB();
    const picks = await EditorsPick.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ picks });
  } catch (error) {
    console.error("GET /api/admin/editors-pick error:", error);
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
      overview = "",
      curatorNote = "",
    } = body;

    if (!movieId || !title) {
      return NextResponse.json(
        { error: "movieId and title are required" },
        { status: 400 }
      );
    }

    const existing = await EditorsPick.findOne({ movieId, mediaType });
    if (existing) {
      return NextResponse.json(
        { error: `"${title}" is already in Editor's Pick` },
        { status: 409 }
      );
    }

    const count = await EditorsPick.countDocuments();

    const newPick = await EditorsPick.create({
      movieId,
      mediaType,
      title,
      poster_path,
      backdrop_path,
      vote_average,
      release_date,
      overview,
      curatorNote,
      order: count,
      addedBy: user?._id,
    });

    return NextResponse.json({ success: true, pick: newPick }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/editors-pick error:", error);
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
          EditorsPick.findByIdAndUpdate(id, { order: index })
        )
      );
      const updated = await EditorsPick.find({}).sort({ order: 1, createdAt: -1 });
      return NextResponse.json({ success: true, picks: updated });
    }

    // Single item update: { id, curatorNote, order }
    const { id, curatorNote, order } = body;
    if (!id) {
      return NextResponse.json({ error: "Item id is required" }, { status: 400 });
    }

    const updateFields = {};
    if (typeof curatorNote === "string") updateFields.curatorNote = curatorNote;
    if (typeof order === "number") updateFields.order = order;

    const updatedItem = await EditorsPick.findByIdAndUpdate(id, updateFields, { new: true });
    return NextResponse.json({ success: true, pick: updatedItem });
  } catch (error) {
    console.error("PUT /api/admin/editors-pick error:", error);
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

    await EditorsPick.findByIdAndDelete(id);

    // Resequence remaining picks
    const remaining = await EditorsPick.find({}).sort({ order: 1, createdAt: -1 });
    await Promise.all(
      remaining.map((item, idx) =>
        EditorsPick.findByIdAndUpdate(item._id, { order: idx })
      )
    );

    return NextResponse.json({ success: true, message: "Item removed from Editor's Pick" });
  } catch (error) {
    console.error("DELETE /api/admin/editors-pick error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
