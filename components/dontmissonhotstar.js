"use client"
import DontMissRow from "@/components/dontmissrow"

const DontMissOnHotstar = () => (
  <DontMissRow
    title="Don't Miss on Jiohotstar"
      accentColor="#0b4dbb"
    fetchParams={{
      type: "provider",
        provider_id: 2336, // TMDB provider id for JioHotstar in India
      watch_region: "IN",
      type_of: "movie",
    }}
  />
)

export default DontMissOnHotstar