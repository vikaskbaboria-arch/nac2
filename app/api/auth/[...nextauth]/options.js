import connectDB from "@/db";
import User from "@/models/user.js";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        await connectDB();
        const userEmail = user?.email || profile?.email;
        if (!userEmail) return false;

        const adminEmails = (process.env.ADMIN_EMAIL || "")
          .split(",")
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean);
        const shouldBeAdmin = adminEmails.includes(userEmail.toLowerCase());

        let currentUser = await User.findOne({ email: userEmail });
        if (!currentUser) {
          currentUser = await User.create({
            email: userEmail,
            username: userEmail.split("@")[0],
            name: user?.name || profile?.name || userEmail.split("@")[0],
            profilepic: user?.image || profile?.picture || "",
            isAdmin: shouldBeAdmin,
            role: shouldBeAdmin ? "admin" : "user",
          });
        } else {
          let changed = false;
          if (!currentUser.name && (user?.name || profile?.name)) {
            currentUser.name = user?.name || profile?.name;
            changed = true;
          }
          if (!currentUser.profilepic && (user?.image || profile?.picture)) {
            currentUser.profilepic = user?.image || profile?.picture;
            changed = true;
          }
          if (shouldBeAdmin && !currentUser.isAdmin) {
            currentUser.isAdmin = true;
            currentUser.role = "admin";
            changed = true;
          }
          if (changed) await currentUser.save();
        }

        return profile?.email_verified && profile?.email?.endsWith("@gmail.com");
      }
      return true;
    },
    async session({ session }) {
      if (session?.user?.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
          session.user.name = dbUser.username;
          session.user.id = String(dbUser._id);
          session.user.displayName = dbUser.name || dbUser.username;
          session.user.image = dbUser.profilepic || session.user.image || "";

          const adminEmails = (process.env.ADMIN_EMAIL || "")
            .split(",")
            .map((e) => e.trim().toLowerCase())
            .filter(Boolean);
          const isAdmin = Boolean(
            dbUser.isAdmin || adminEmails.includes(dbUser.email?.toLowerCase())
          );
          session.user.isAdmin = isAdmin;
          session.user.role = isAdmin ? "admin" : (dbUser.role || "user");
        }
      }
      return session;
    },
  },
};
