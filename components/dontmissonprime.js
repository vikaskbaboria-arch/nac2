"use client"
import DontMissRow from "@/components/dontmissrow"

const DontMissOnPrimeVideo = () => (
  <DontMissRow
    title="Don't Miss on Prime Video"
    accentColor="#00a8e1"
    fetchParams={{
      type: "provider",
      provider_id: 119, // TMDB provider id for Amazon Prime Video
      watch_region: "IN",
      type_of: "movie",
    }}
  />
)

export default DontMissOnPrimeVideo