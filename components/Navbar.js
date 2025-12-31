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

  const handleChange=(e)=>{ setSearch(e.target.value) }
  const handleClick=()=>{
    if (!search) return
    router.push(`/search/${search}`)
    setSearch(""); setInput(""); setSuggest(""); setSuggestions(null); setButton(false)
  }
  const handleB=(m)=>{ setInput(m.target.value) }

  useEffect(()=>{
    const timer = setTimeout(() => { setSuggest(input); }, 800)
    return () => clearTimeout(timer)
  },[input])

  useEffect(()=>{
    fetchMovies({type:"search",type_of:"multi", query: suggest})
    .then((m)=>(setSuggestions(m)))
  },[suggest])

  const handleLnk=(m)=>{
    if(m.media_type==="movie"){ router.push(`/movie/${m?.id}`) }
    else{ router.push(`/series/${m.id}`) }
    setSearch(""); setInput(""); setSuggest(""); setSuggestions(null); setButton(false)
  }

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`
        sticky top-0 z-50 w-full
        px-4 sm:px-6 h-16
        flex items-center justify-between
        text-white
        transition-all duration-300
        ${scrolled
          ? "bg-black/60 backdrop-blur-xl shadow-lg"
          : "bg-black/90"}
      `}
    >

      {/* LOGO */}
      <Link href="/" className="flex items-center gap-2">
        <img
          className="w-16 h-8 sm:w-20 sm:h-10 hover:scale-105 transition"
          src="/Gemini_Generated_Image_oq1x85oq1x85oq1x.png"
          alt="MOCTALE"
        />
      </Link>

      {/* CENTER LINKS */}
      <ul className="hidden sm:flex items-center gap-4 text-sm font-medium">
        <li className="hover:text-purple-400 transition"><Link href="/">Home</Link></li>
        <li className="hover:text-purple-400 transition"><Link href="/about">About</Link></li>

        {/* SEARCH BUTTON */}
        <button
          onClick={()=>setButton(!button)}
          className="px-3 py-1.5 rounded-md
          bg-white/5 hover:bg-white/10
          border border-white/10
          backdrop-blur-md transition"
        >
          Search
        </button>
      </ul>

      {/* SEARCH OVERLAY */}
      <div className={`absolute left-0 top-full w-full flex justify-center transition-all ${button ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="relative mt-4 w-[95vw] sm:w-[70vw] lg:w-[50vw]">
          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 p-2">
            <input
              value={search}
              onChange={(e)=>{handleChange(e); handleB(e)}}
              placeholder="Search movies or series..."
              className="flex-1 bg-transparent outline-none text-white px-2"
            />
            <button onClick={handleClick} className="hover:scale-110 transition">
              <img src="/r.svg" alt="" width={22} />
            </button>
          </div>

          {/* SUGGESTIONS */}
          {suggestions?.results?.slice(0,4).length > 0 && (
            <div className="absolute mt-2 w-full bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
              {suggestions.results.slice(0,4).map((m)=>(
                <div
                  key={m.id}
                  onClick={()=>handleLnk(m)}
                  className="flex items-center gap-3 p-2 hover:bg-white/5 cursor-pointer transition"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w92/${m.poster_path}`}
                    className="h-12 rounded-md"
                    alt=""
                  />
                  <span className="text-sm font-semibold text-white flex-1">
                    {m?.title || m?.name}
                  </span>
                  <span className="text-xs bg-green-500 px-2 py-0.5 rounded">
                    {m.vote_average}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* USER / LOGIN */}
      <div className="flex items-center gap-3">
        {session ? (
          <div className="relative">
            <button
              onClick={()=>setDropdown2(!dropdown2)}
              className="px-3 py-1.5 rounded-md text-xs sm:text-sm
              bg-gradient-to-br from-purple-700 to-pink-600
              hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]
              transition"
            >
              {session.user.email.split("@")[0]}
            </button>

            <div className={`absolute right-0 mt-3 w-44 rounded-xl
              bg-black/90 backdrop-blur-xl border border-white/10
              transition-all origin-top
              ${dropdown2 ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}>
              <ul className="text-sm">
                <li className="p-2 hover:bg-white/5"><Link href="#">Profile</Link></li>
                <li className="p-2 hover:bg-white/5"><Link href="#">Settings</Link></li>
                <li className="p-2 hover:bg-white/5"><Link href="#">Earnings</Link></li>
                <li className="p-2 hover:bg-red-500/10">
                  <button onClick={() => signOut()}>Sign out</button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <Link href="/login" className="hover:text-purple-400 transition">Login</Link>
        )}
      </div>

    </nav>
  )
}

export default Navbar
