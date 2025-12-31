import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { notFound } from "next/navigation";
import ProfileClient from "@/components/ProfileClient";

export default async function ProfilePage({ params }) {
  const session = await getServerSession(authOptions);

  // ❌ No session → page does not exist
  if (!session) {
    notFound();
  }

  const usernameFromUrl = params.username;
  const usernameFromSession = session.user.email.split("@")[0];

  // ❌ URL username mismatch → 404
  if (usernameFromUrl !== usernameFromSession) {
    notFound();
  }

  // ✅ Safe to render profile
  return <ProfileClient username={usernameFromSession} />;
}
