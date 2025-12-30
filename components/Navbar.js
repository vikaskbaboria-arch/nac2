"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchMovies } from '@/lib/masterfetch'
import { signIn, signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'

const Navbar = () => {
  const { data: session, status } = useSession();
  const[button,setButton]=useState(false)
  const[dropdown2,setDropdown2]=useState(false)
  const[search,setSearch]=useState("")
  const router=useRouter()
  const [input,setInput] =useState("")
  const [suggest,setSuggest]=useState("")
  const[suggestions,setSuggestions]=useState(null)
   const handleChange=(e)=>{
    setSearch(e.target.value)
   }
  const handleClick=()=>{
      if (!search) return
      router.push(`/search/${search}`)
      // clear input and suggestions after navigating
      setSearch("")
      setInput("")
      setSuggest("")
      setSuggestions(null)
      setButton(false)
  }
  const handleB=(m)=>{
     setInput(m.target.value)
  }
  useEffect(()=>{
  const timer = setTimeout(() => {
    setSuggest(input);
  }, 800); // waits 500ms after typing stops

  return () => clearTimeout(timer);
  },[input])
  console.log(suggest)


useEffect(()=>{
  fetchMovies({type:"search",type_of:"multi", query: suggest,}).
  then((m)=>(setSuggestions(m)))
},[suggest])

console.log(suggestions)
const handleLnk=(m)=>{
  if(m.media_type==="movie"){
    router.push(`/movie/${m?.id}`);}
   else{
    router.push(`/series/${m.id}`);
   }
    setSearch("")
      setInput("")
      setSuggest("")
      setSuggestions(null)
      setButton(false)
   
}  
const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`
        sticky top-0 z-50
        w-full h-16 px-6
        flex items-center justify-between
        text-white
        transition-all duration-300
        ${scrolled ? "bg-black/70 backdrop-blur-md" : "bg-black"}
      `}>
  <div>
    <Link href={'/'}><img className='w-20 h-10' src="/Gemini_Generated_Image_oq1x85oq1x85oq1x.png" alt="MOCTALE" /></Link>
  </div>
     <div className='flex justify-center gap-8'>
        <ul className='text-l flex items-center '>
            <li className='inline-block mx-4 focus:outline-none focus-visible:outline-none'><Link href="/">Home</Link></li>
            <li className='inline-block mx-4'><Link href="/about">About</Link></li> 
          

            {/* {code for search} */}


<button  onClick={()=>setButton(!button)} id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="inline-flex justify-center ml-2   items-center text-white bg-brand " type="button">
  
Search
</button>


<div id="dropdown"   className={`z-10 ${button? "" : "hidden"} w-[99vw] absolute left-0 top-20  flex justify-center   mt-1`}>
   
         <div className=' w-[90vw]  bg-gray-900  gap-2 h-[56] flex items-center justify-center rounded-lg border-amber-50 border-1   '>
        <input value={search} type="text" onChange={(e)=>{handleChange(e); handleB(e)}}  className=' w-[87vw] bg-gray-900 h-[50]  outline-none  hover:bg-neutral-tertiary-medium hover:text-heading rounded' />
        <button className='' onClick={handleClick}><img src="/r.svg" alt="" height={22} width={22} /></button>
        
    </div>
  <div className='absolute mt-16  rounded left-[4.4vw] w-80  '>
     {
      suggestions?.results?.slice(0,4).map((m)=>{
        return (
          
          <div  
        key={m.id} onClick={()=>{handleLnk(m);setButton(!button)}}
        className=' rounded-md h-12 bg-black my-0.5 px-2'
      >
        <div  className="poster p h-full flex justify-between items-center ">
          <img
            src={`https://image.tmdb.org/t/p/w92/${m.poster_path}`}
            className='rounded-md h-full'
            alt={m.title}
          />
              <div className='text-amber-50  flex flex-wrap ml-9 mt-4 absolute font-bold text-l'>
        {m?.title || m?.name}
       </div>
      <span className=' font-bold top-2 text-slate-100 right-4 text-xs bg-green-500 h-6 w-12 px-1 rounded flex mt-2 items-center text-center'>
          {m.vote_average}
          </span>
        </div>
   
      </div>
        )
      })
     }
</div>
</div>


</ul>












{/* {till here} */}
           {session? ( <>
<button onClick={()=>setDropdown2(!dropdown2)} id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="bg-gradient-to-br from-purple-700 via-purple-800  inline-flex items-center justify-center text-white hover:bg-gradient-to-bl  sm:focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium text-xs  sm:text-l rounded-md text-sm px-1 sm:px-4 py-2" type="button">
   {session.user.email.split("@")[0]}
   
  <svg className="w-4 h-4 ms-1.5 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/></svg>
</button>


<div id="dropdown" className ={` z-10 ${dropdown2?"":"hidden"} absolute right-0 mt-2 bg-gradient-to-br from-purple-500 to-purple-00 rounded-md shadow-lg right-6 w-44 mt-10`}>
    <ul className="p-2 text-sm text-body font-medium" aria-labelledby="dropdownDefaultButton ">
      <li>
        <Link href={`http://localhost:3000/ ${session.user?.name}`}  onClick={()=>setDropdown2(!dropdown2)} className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Profile</Link>
      </li>
      <li>
        <Link href="#" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Settings</Link>
      </li>
      <li>
        <Link href="#" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Earnings</Link>
      </li>
      <li>
     <button onClick={() => signOut()} className="block w-full p-2 cursor-pointer">Sign out</button>
      </li>
    </ul>
</div>
</>
            ):
            (<li className='inline-block mx-4'><Link href="/login">Login</Link></li>)
           }
        
        </div>  
    </nav>
  )
}

export default Navbar