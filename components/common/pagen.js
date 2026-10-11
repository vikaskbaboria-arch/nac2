"use client"
  import React, { useEffect, useState } from 'react'
  const Pagen = ({ movie }) => {
  const pages = movie?.total_pages ?? 1
  const [page, setPage] = useState(1)
  const [mulpage, setMulpage] = useState(() => pages > 1)
  
  useEffect(() => { setMulpage(pages > 1) }, [pages])
  
  const pagesArray = Array.from({ length: Math.max(1, pages) }, (_, i) => i + 1)
  
  return (
  <div className='text white'>
  <p>Page: {page}</p>{pages > 1? (mulpage && pagesArray.map(p => (
  <button key={p} onClick={() => setPage(p)}>{p}</button>
  ))) : <p>no more pages</p>}
  {movie?.title}
 
  </div>
  )
  }
  export default Pagen