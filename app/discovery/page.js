import { Suspense } from "react";
import Discovery from "@/components/explore/Discovery";
import { MediaListSkeleton } from "@/components/skeletons/HomeSectionSkeletons";

export default function DiscoveryPage() {
  return (
    <Suspense fallback={<MediaListSkeleton label="discovery titles" count={5} />}>
      <Discovery />
    </Suspense>
  );
}