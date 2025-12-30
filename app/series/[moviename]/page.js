// "use client"
import Search from "@/components/result"
import SeriesR from "@/components/seriesres"
import { fetchProviders } from "@/fetch/providers"
const SearchPage = async ({ params }) => {
  const { moviename } = await params   // ✅ unwrap params FIRST
  console.log(moviename)               // ✅ logs in TERMINAL

     const providers = await fetchProviders({
    media_type: "tv",
    id: moviename,})

    console.log(providers)

  return (
    <>
     
      <SeriesR movie={moviename}  streamer ={providers}  />
      
    </>
  )
}

export default SearchPage