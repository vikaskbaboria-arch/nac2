"use client"
import React, { useEffect, useState } from 'react'
import { RatingSkeleton } from '@/components/skeletons/HomeSectionSkeletons'

const Rating = ({movieId}) => {
    const  [rating,setRating]=useState(null)
    const [loadedMovieId, setLoadedMovieId] = useState(null)
useEffect(()=>{
        
    const loadRating =async()=>{
        try{
       const data = (await fetch(`/api/review?movieId=${movieId}`))
       const res = await data.json();
      const rate = await res.averageRating
      setRating(rate)
      setLoadedMovieId(movieId)
       
       return  rate
        }
        catch(err){
            console.log(err)
            setRating(null)
            setLoadedMovieId(movieId)

        }
    }
    // console.log(loadRating())
    loadRating();
},[movieId])
  return (
    <div>
          {loadedMovieId !== movieId ? <RatingSkeleton /> : rating ? <div>{rating}</div> : <div>N/A</div>}
    </div>

    
  )
}

export default Rating