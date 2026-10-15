"use client"
import DontMissRow from "@/components/home/dontmissrow"

const DontMissOnNetflix = ({ initialMovies = null, initialLogo = null }) => (
  <DontMissRow
    title="Don't Miss on Netflix"
    accentColor="#e50914"
    initialMovies={initialMovies}
    initialProviderLogo={initialLogo}
    fetchParams={{
      type: "provider",
      provider_id: 8, // TMDB provider id for Netflix
      watch_region: "IN",
      type_of: "movie",
    }}
  />
)

export default DontMissOnNetflix