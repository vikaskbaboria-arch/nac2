// "use client"
import Search from "@/components/result"
import SeriesR from "@/components/seriesres"

const SearchPage = async ({ params }) => {
  const { moviename } = await params   // ✅ unwrap params FIRST
  console.log(moviename)               // ✅ logs in TERMINAL


  return (
    <>
     
      <SeriesR movie={moviename} />
      
    </>
  )
}

export default SearchPage