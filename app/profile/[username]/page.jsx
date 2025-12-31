import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { notFound } from "next/navigation";
import ProfileClient from "@/components/ProfileClient";

export default async function ProfilePage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    notFound();
  }

  const usernameFromUrl = params.username.toLowerCase().trim();
  const usernameFromSession = session.user.email
    .split("@")[0]
    .toLowerCase()
    .trim();

  if (usernameFromUrl !== usernameFromSession) {
    notFound();
  }

  return <ProfileClient username={usernameFromSession} />;
}
