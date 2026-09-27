import { NextResponse } from "next/server";
import connectDB from "@/db";
import EditorsPick from "@/models/editorsPick";

export async function GET() {
  try {
    await connectDB();
    const picks = await EditorsPick.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ picks });
  } catch (error) {
    console.error("GET /api/editors-pick error:", error);
    return NextResponse.json({ error: error.message, picks: [] }, { status: 500 });
  }
}
