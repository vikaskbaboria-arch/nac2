import { NextResponse } from "next/server";
import { checkIsAdmin } from "@/lib/admin";

export async function GET() {
  try {
    const { isAdmin, session } = await checkIsAdmin();

    return NextResponse.json({
      authenticated: Boolean(session?.user?.email),
      isAdmin,
      email: session?.user?.email || null,
      username: session?.user?.name || null,
    });
  } catch (error) {
    console.error("GET /api/admin/check error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
