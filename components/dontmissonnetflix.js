"use client"
import DontMissRow from "@/components/dontmissrow"

const DontMissOnNetflix = () => (
  <DontMissRow
    title="Don't Miss on Netflix"
    accentColor="#e50914"
    fetchParams={{
      type: "provider",
      provider_id: 8, // TMDB provider id for Netflix
      watch_region: "IN",
      type_of: "movie",
    }}
  />
)

export default DontMissOnNetflix