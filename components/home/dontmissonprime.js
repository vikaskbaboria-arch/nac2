"use client"
import DontMissRow from "@/components/home/dontmissrow"

const DontMissOnPrimeVideo = ({ initialMovies = null, initialLogo = null }) => (
  <DontMissRow
    title="Don't Miss on Prime Video"
    accentColor="#00a8e1"
    initialMovies={initialMovies}
    initialProviderLogo={initialLogo}
    fetchParams={{
      type: "provider",
      provider_id: 119, // TMDB provider id for Amazon Prime Video
      watch_region: "IN",
      type_of: "movie",
    }}
  />
)

export default DontMissOnPrimeVideo