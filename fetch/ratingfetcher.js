
// "use client"
export const fetchratings = async(movieId)=>{

   const ratings =(await fetch(`/api/review?movieId=${movieId}`))
    const res = await ratings.json();
    // return res
return res.averageRating
}