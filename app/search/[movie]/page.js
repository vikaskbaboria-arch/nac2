import React from 'react'
import Search from '@/components/search/search'
const page = async ({params}) => {
const {movie} =await params
  return (<>
    <Search movie={movie} />
    
    
    </>
  )
}

export default page