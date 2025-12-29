export const fetchdata=async(movie)=>{
    console.log(movie)
    const data = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${movie}`,{method:"GET"},{ next: { revalidate: 3600 } })
    const res = await data.json()
    return res
   
}
