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
    async signIn({ user, account, profile, email }) {
      if (account.provider === "google") {
        await connectDB();
        const currentUser = await User.findOne({ email: email });
        if (!currentUser) {
          const newUser = await User.create({
            email: user.email,
            username: user.email.split("@")[0],
          });
          await newUser.save();
        }

        return profile.email_verified && profile.email.endsWith("@gmail.com");
      }
      return true;
    },
    async session({ session }) {
      const dbUser = await User.findOne({ email: session.user.email });
      if (dbUser) session.user.name = dbUser.username;
      return session;
    },
  },
};
