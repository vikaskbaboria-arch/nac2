"use client"
import DontMissRow from "@/components/home/dontmissrow"

const DontMissOnHotstar = ({ initialMovies = null, initialLogo = null }) => (
  <DontMissRow
    title="Don't Miss on Jiohotstar"
    accentColor="#0b4dbb"
    initialMovies={initialMovies}
    initialProviderLogo={initialLogo}
    fetchParams={{
      type: "provider",
      provider_id: 2336, // TMDB provider id for JioHotstar in India
      watch_region: "IN",
      type_of: "movie",
    }}
  />
)

export default DontMissOnHotstar