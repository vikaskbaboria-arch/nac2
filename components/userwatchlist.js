"use client"

import React, { useEffect, useState } from 'react'
import Watchcomp from './watchcomp'
const Userwatchlist = () => {
    const [movies,setMovies]= useState([])
    const [watchlist,setWatchlist]=useState([])
    
    useEffect(()=>{
        const loadData = async()=>{
           const res = await fetch(`/api/watchlist`,{
            method: "GET"}

           )
           const data = await res.json();
           setWatchlist(data.watchlist)
        }
      loadData();
    
    },[])
    useEffect(()=>{
        if(watchlist.length>0){
            const mid=  watchlist.map(item =>  item.movie.movieid);
            setMovies(mid);
        }
    },[watchlist])
 
    console.log(watchlist)
    console.log(movies)
  return (
    <div>
        {movies.map(m=>{
            return(
          
                <Watchcomp key={m} movieid={m}/>
          
            
                )
        })}
    </div>
  )
}

export default Userwatchlist