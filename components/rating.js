"use client"
import React, { useEffect, useState } from 'react'

const Rating = ({movieId}) => {
    const  [rating,setRating]=useState(null)
useEffect(()=>{
        
    const loadRating =async()=>{
        try{
       const data = (await fetch(`/api/review?movieId=${movieId}`))
       const res = await data.json();
      const rate = await res.averageRating
      setRating(rate)
       
       return  rate
        }
        catch(err){
            console.log(err)

        }
    }
    // console.log(loadRating())
    loadRating();
},[movieId])
  return (
    <div>
          {!rating?(<div className="w-12 h-6   rounded-md animate-pulse blur-sm "><div className="w-10 h-10 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin"></div>
</div>):(!rating?(<div  >N/A</div>): (<div> {rating}</div>))  }
    </div>

    
  )
}

export default Rating