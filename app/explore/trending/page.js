import { Suspense } from "react";
import TrendingPage from "@/components/explore/TrendingPage";

export const metadata = {
  title: "Trending Movies & TV Shows | NAC",
  description: "Explore the most popular and trending movies and TV series worldwide.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] w-full" />}>
      <TrendingPage />
    </Suspense>
  );
}
