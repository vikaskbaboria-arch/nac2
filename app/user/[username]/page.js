import { redirect } from "next/navigation";

export default async function LegacyUserProfile({ params }) {
  const { username } = await params;
  redirect(`/profile/${encodeURIComponent(username)}`);
}
