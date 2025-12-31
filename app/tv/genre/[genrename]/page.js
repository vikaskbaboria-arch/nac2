// "use client"
import Search from "@/components/result"
import { generename } from "@/fetch/genre"
// import { useEffect } from "react"
import Genre from "@/components/genre"
const SearchPage = async ({ params }) => {
const p=await params
const genreno =p.genrename
// console.log(genreno)

  return (
    <>
 <Genre no={genreno} type={"tv"}/>
      
    </>
  )
}

export default SearchPage