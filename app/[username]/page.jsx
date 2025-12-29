import React from 'react'
import Profile from '@/components/Profile'
const profile = ({params}) => {
const d=params.username

console.log(d)
  return (
    
<>

{d}
<Profile username={d}/>
</>
  )
}

export default Profile