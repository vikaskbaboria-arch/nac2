import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import connectDB from "@/db";
import User from "@/models/user";

export async function checkIsAdmin() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { isAdmin: false, session: null, user: null, noAdminExists: false };
    }

    await connectDB();
    const dbUser = await User.findOne({ email: session.user.email });
    const isAdmin = Boolean(dbUser?.isAdmin);

    return {
      isAdmin,
      session,
      user: dbUser,
    };
  } catch (error) {
    console.error("checkIsAdmin error:", error);
    return { isAdmin: false, session: null, user: null };
  }
}
