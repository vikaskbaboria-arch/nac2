"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchMovies } from '@/lib/masterfetch'

import { signOut } from 'next-auth/react'
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

  const [mobileMenu, setMobileMenu] = useState(false); // ✅ ADDED

  const handleChange=(e)=>{ setSearch(e.target.value) }
  const handleClick=()=>{
    if (!search) return
    router.push(`/search/${search}`)
    setSearch(""); setInput(""); setSuggest(""); setSuggestions(null)
    setButton(false); setMobileMenu(false)
  }
  const handleB=(m)=>{ setInput(m.target.value) }

  useEffect(()=>{
    const timer = setTimeout(() => { setSuggest(input) }, 800)
    return () => clearTimeout(timer)
  },[input])

  useEffect(()=>{
    fetchMovies({type:"search",type_of:"multi", query: suggest})
    .then((m)=>(setSuggestions(m)))
  },[suggest])

  // fetch ratings for suggestion items


  const handleLnk=(m)=>{
    if(m.media_type==="movie"){ router.push(`/movie/${m?.id}`) }
    else{ router.push(`/series/${m.id}`) }
    setSearch(""); setInput(""); setSuggest(""); setSuggestions(null)
    setButton(false); setMobileMenu(false)
  }

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`
      sticky top-0 z-50 w-full h-16 px-4 sm:px-6
      flex items-center justify-between text-white
      transition-all duration-300
      ${scrolled ? "bg-black/60 backdrop-blur-xl shadow-lg" : "bg-black"}
    `}>

      {/* LOGO */}
      <Link href="/" className="flex items-center w-16 ">
        <img
          className="w-18 h-8 sm:w-22 sm:h-14 hover:scale-105 transition "
          src="/ChatGPT Image Dec 31, 2025, 07_54_03 PM.png"
          alt="MOCTALE"
        />
      </Link>

      {/* DESKTOP LINKS */}
      
      <ul className="hidden bg-black/5 hover:bg-black/20 border border-white/10 backdrop-blur-md transition sm:flex items-center gap-4 px-2 py-1 text-sm font-medium bg-gray-950 rounded-2xl">
        <li className="hover:text-purple-400 transition"><Link href="/">Home</Link></li>
       
        <li className="hover:text-purple-400 transition"><Link href="/about">About</Link></li>{status === 'authenticated' && session ? (
        <li className="hover:text-purple-400 transition"><Link href={`/profile/${session.user.email.split("@")[0]}`}>
  Profile
</Link></li>) : null}

        <button
          onClick={()=>setButton(!button)}
          className="px-1 py-1 rounded-md bg-white/5 hover:bg-gray-600 border border-white/10 backdrop-blur-md transition"
        >
          Search
        </button>
      </ul>
        
      {/* MOBILE HAMBURGER */}
      <button
        onClick={()=>setMobileMenu(!mobileMenu)}
        className="sm:hidden text-xl"
      >
        ☰
      </button>

      {/* USER / LOGIN */}
      <div className="hidden sm:flex items-center gap-3">
        {status === 'loading' ? (
          <div className="text-sm text-gray-400">...</div>
        ) : session ? (
          <div className="relative">
            <button
              onClick={()=>setDropdown2(!dropdown2)}
              className="px-3 py-1.5 rounded-md text-xs sm:text-sm
              bg-gradient-to-br from-purple-700 to-pink-600
              hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition"
            >
              {session.user.email.split("@")[0]}
            </button>

            <div className={`absolute right-0 mt-3 w-44 rounded-xl
              bg-black/90 backdrop-blur-xl border border-white/10
              transition-all origin-top
              ${dropdown2 ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}>
              <ul className="text-sm">
                <li className="p-2 hover:bg-white/5"><Link href={`/profile/${session.user.email.split("@")[0]}`}>
  Profile
</Link></li>
                <li className="p-2 hover:bg-white/5"><Link href="/chats">chats</Link></li>
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

      {/* MOBILE MENU */}
      <div className={`
        absolute top-16 left-0 w-full sm:hidden
        bg-black/90 backdrop-blur-xl border-t border-white/10
        transition-all duration-300
        ${mobileMenu ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
      `}>
        <Link onClick={()=>setMobileMenu(false)} className="block p-4 border-b border-white/10" href="/">Home</Link>
        <Link onClick={()=>setMobileMenu(false)} className="block p-4 border-b border-white/10" href="/about">About</Link> {session && status === 'authenticated' ? (
          <Link onClick={()=>setMobileMenu(false)}  href="/chats" className="hover:text-purple-400 transition">
            Chats
          </Link>):null}
        <button onClick={()=>{setButton(true); setMobileMenu(false)}} className="block w-full text-left p-4">
          Search
        </button>
        {status === 'loading' ? (
          <div className="block p-4 text-sm text-gray-400">...</div>
        ) : status === 'authenticated' && session ? (
          <>
            <Link onClick={()=>setMobileMenu(false)} className="block p-4 border-b border-white/10" href={`/profile/${session.user.email.split("@")[0]}`}>
              Profile
            </Link>
            <button onClick={() => signOut()} className="block w-full text-left p-4 text-red-400">
              Sign out
            </button>
          </>
        ) : (
          <Link onClick={()=>setMobileMenu(false)} className="block p-4" href="/login">Login</Link>
        )}
      </div>

      {/* SEARCH OVERLAY (SHARED) */}
      {button && (
        <div className="absolute left-0 top-16 w-full flex justify-center z-40">
          <div className="relative mt-4 w-[95vw] sm:w-[70vw] lg:w-[50vw]">
            <div className="flex items-center gap-2 bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 p-2">
              <input
                value={search}
                onChange={(e)=>{handleChange(e); handleB(e)}}
                placeholder="Search movies or series..."
                className="flex-1 bg-transparent outline-none text-white px-2"
              />
              <button onClick={handleClick}>
                <img src="/r.svg" alt="" width={22} />
              </button>
            </div>

            {suggestions?.results?.slice(0,4).length > 0 && (
              <div className="absolute mt-2 w-full bg-black/90 backdrop-blur-xl rounded-xl border border-white/10">
                {suggestions.results.slice(0,4).map((m)=>(
                  <div
                    key={m.id}
                    onClick={()=>handleLnk(m)}
                    className="flex items-center gap-3 p-2 hover:bg-white/5 cursor-pointer"
                  >
                    <img src={m.poster_path?`https://image.tmdb.org/t/p/w92/${m.poster_path}`:'/placeholder.png'} className="h-12 rounded-md" />
                    <span className="text-sm font-semibold flex-1">
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
      )}

    </nav>
  )
}

export default Navbar
