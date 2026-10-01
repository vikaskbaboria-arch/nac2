"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchMovies } from '@/lib/masterfetch'

import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { SearchSuggestionsSkeleton } from '@/components/skeletons/HomeSectionSkeletons'
import { Bookmark, Compass, Globe2, Home, Languages, Search as SearchIcon, Shapes } from 'lucide-react'

const Navbar = () => {
  const { data: session, status } = useSession();
  const[button,setButton]=useState(false)
  const[dropdown2,setDropdown2]=useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const[search,setSearch]=useState("")
  const searchPanelRef = useRef(null)
  const router=useRouter()
  const [input,setInput] =useState("")
  const [suggest,setSuggest]=useState("")
  const[suggestions,setSuggestions]=useState(null)
  const [suggestionLoading, setSuggestionLoading] = useState(false)

  const [navHidden, setNavHidden] = useState(false)

  const handleChange=(e)=>{ setSearch(e.target.value) }
  const handleClick=()=>{
    if (!search) return
    router.push(`/search/${search}`)
    setSearch(""); setInput(""); setSuggest(""); setSuggestions(null)
    setButton(false)
  }
  const handleB=(m)=>{
    const value = m.target.value
    setInput(value)
    setSuggestionLoading(Boolean(value.trim()))
    if (!value.trim()) setSuggestions(null)
  }

  useEffect(()=>{
    const timer = setTimeout(() => { setSuggest(input) }, 800)
    return () => clearTimeout(timer)
  },[input])

  useEffect(()=>{
    if (!suggest.trim()) return
    fetchMovies({type:"search",type_of:"multi", query: suggest})
      .then((m)=>(setSuggestions(m)))
      .catch((error) => {
        console.error("Failed to load search suggestions:", error)
        setSuggestions(null)
      })
      .finally(() => setSuggestionLoading(false))
  },[suggest])

  useEffect(() => {
    if (!button) return

    const handleOutsidePointer = (event) => {
      if (!searchPanelRef.current?.contains(event.target)) setButton(false)
    }
    const handleEscape = (event) => {
      if (event.key === "Escape") setButton(false)
    }

    document.addEventListener("pointerdown", handleOutsidePointer)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [button])

  // fetch ratings for suggestion items


  const handleLnk=(m)=>{
    if(m.media_type==="movie"){ router.push(`/movie/${m?.id}/?type=movie`) }
    else{ router.push(`/movie/${m.id}?type=tv`) }
    setSearch(""); setInput(""); setSuggest(""); setSuggestions(null)
    setButton(false)
  }

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let previousScrollY = window.scrollY
    const desktopQuery = window.matchMedia("(min-width: 768px)")
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 10)

      if (desktopQuery.matches) {
        setNavHidden(false)
        previousScrollY = currentScrollY
        return
      }

      if (currentScrollY <= 20) {
        setNavHidden(false)
      } else if (currentScrollY - previousScrollY > 6) {
        setNavHidden(true)
      } else if (previousScrollY - currentScrollY > 6) {
        setNavHidden(false)
      }

      previousScrollY = currentScrollY
    }
    const handleResize = () => {
      previousScrollY = window.scrollY
      if (desktopQuery.matches) setNavHidden(false)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <>
    <nav className={`
      fixed top-0 z-50 w-full h-16 px-4 sm:px-6 lg:px-12 xl:px-24
      flex items-center justify-between text-white
      transition-all duration-300 ease-in-out
      border-b border-white/10 backdrop-blur-md
      ${scrolled ? "bg-black/60 backdrop-blur-xl shadow-lg" : "bg-black"}
      ${navHidden ? "-translate-y-full md:translate-y-0" : "translate-y-0"}
    `}>

      {/* LOGO */}
      <Link href="/" className="flex items-center w-16 ">
       <svg
      viewBox="0 0 170 68"
      role="img"
      aria-label="NAC"
    
      
    >
      <title>NAC</title>
      <defs>
        <linearGradient id="nac-accent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
 
      <g
        fill="none"
        stroke="#ffffff"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* N */}
        <path d="M10,54 L10,10 L48,54 L48,10" />
        {/* A (legs only; crossbar drawn separately in the accent color) */}
        <path d="M64,54 L84,10 L104,54" />
        {/* C (a squared bracket, open on the right — matches N/A's straight-line construction) */}
        <path d="M158,10 L118,10 L118,54 L158,54" />
      </g>
 
      {/* The one accent: the A's crossbar, in the site's signature gradient */}
      <line
        x1="72"
        y1="37"
        x2="96"
        y2="37"
        stroke="url(#nac-accent)"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
      </Link>

      {/* DESKTOP LINKS */}
      
      <ul className="hidden z-50 backdrop-blur-xl bg-black/5 hover:bg-white/5 border border-white/10 backdrop-blur-md transition sm:flex items-center gap-4 px-3 py-1 text-sm font-medium bg-gray-950 rounded-2xl">
        <li className="hover:text-gray-400 transition"><Link href="/">Home</Link></li>
        <li className="hover:text-gray-400 transition"><Link href="/collection">Collection</Link></li>
        <li className="relative">
          <button
            type="button"
            onClick={() => setExploreOpen((open) => !open)}
            aria-expanded={exploreOpen}
            aria-haspopup="menu"
            className="flex items-center gap-1 px-2 py-1 hover:text-gray-400 transition"
          >
            Explore
            <span aria-hidden="true" className="text-[10px]">{exploreOpen ? "▲" : "▼"}</span>
          </button>
          {exploreOpen && (
            <div role="menu" className="absolute left-0 top-full mt-3 w-52 overflow-hidden rounded-lg border border-white/15 bg-black/95 p-1 shadow-xl backdrop-blur-xl">
              <Link
                role="menuitem"
                href="/explore/country"
                onClick={() => setExploreOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/85 transition hover:bg-white/10 hover:text-white"
              >
                <Globe2 size={17} aria-hidden="true" /> Countries
              </Link>
              <Link
                role="menuitem"
                href="/explore/genre"
                onClick={() => setExploreOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/85 transition hover:bg-white/10 hover:text-white"
              >
                <Shapes size={17} aria-hidden="true" /> Genres
              </Link>
              <Link
                role="menuitem"
                href="/explore/language"
                onClick={() => setExploreOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/85 transition hover:bg-white/10 hover:text-white"
              >
                <Languages size={17} aria-hidden="true" /> Languages
              </Link>
            </div>
          )}
        </li>
       
       {status === 'authenticated' && session ? (
        <li className="hover:text-gray-400 transition"><Link href={`/profile/${session.user.email.split("@")[0]}`}>
  Profile
</Link></li>) : null}

        {status === 'authenticated' && session?.user?.isAdmin ? (
          <li>
            <Link
              href="/admin"
              className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.4)] hover:shadow-[0_0_18px_rgba(147,51,234,0.7)] transition"
            >
              Admin
            </Link>
          </li>
        ) : null}

        <button
          onClick={()=>setButton(!button)}
          className="px-2 py-1 rounded-md bg-black hover:bg-gray-600/50 hover:text-blue-200 border border-white/10 backdrop-blur-md transition text-xs"
        >
          Search
        </button>
      </ul>
        
      {/* USER / LOGIN */}
      <div className="flex items-center gap-2 sm:gap-3">
        {status === 'loading' ? (
          <div className="text-sm text-gray-400">...</div>
        ) : session ? (
          <div className="relative">
            <button
              onClick={()=>setDropdown2(!dropdown2)}
              className="max-w-[10rem] px-2 py-1.5 rounded-md text-xs sm:max-w-none sm:px-3 sm:text-sm
              bg-gradient-to-br from-purple-800 to-blue-700
              hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition flex items-center gap-1.5"
            >
              <span className="truncate">{session.user.email.split("@")[0]}</span>
              {session.user.isAdmin && (
                <span className="text-[10px] bg-black/40 px-1 rounded uppercase tracking-wider font-bold">Admin</span>
              )}
            </button>

            <div className={`absolute right-0 mt-3 w-48 rounded-xl
              bg-black/90 backdrop-blur-xl border border-white/10
              transition-all origin-top
              ${dropdown2 ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}>
              <ul className="text-sm">
                <li className="p-2 hover:bg-white/5"><Link href={`/profile/${session.user.email.split("@")[0]}`}>
  Profile
</Link></li>
                {session.user.isAdmin && (
                  <li className="p-2 hover:bg-purple-500/20 text-purple-300 font-medium border-t border-b border-white/10">
                    <Link href="/admin">🛡️ Admin Dashboard</Link>
                  </li>
                )}
                <li className="p-2 hover:bg-white/5"><Link href="/collection">NAC Collection</Link></li>
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

      {/* SEARCH OVERLAY (SHARED) */}
      {button && (
        <div className="absolute left-0 top-16 w-full flex justify-center z-40">
          <div ref={searchPanelRef} className="relative mt-4 w-[95vw] sm:w-[70vw] lg:w-[50vw]">
            <form
              onSubmit={(event) => {
                event.preventDefault()
                handleClick()
              }}
              className="flex items-center gap-2 bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 p-2"
            >
              <input
                value={search}
                onChange={(e)=>{handleChange(e); handleB(e)}}
                placeholder="Search movies or series..."
                className="flex-1 bg-transparent outline-none text-white px-2"
              />
              <button type="submit" aria-label="Submit search">
                <img src="/r.svg" alt="" width={22} />
              </button>
            </form>

            {suggestionLoading && input.trim() ? (
              <SearchSuggestionsSkeleton />
            ) : suggestions?.results?.slice(0,4).length > 0 && (
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
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/90 pb-[env(safe-area-inset-bottom)] text-white backdrop-blur-xl sm:hidden"
    >
      <div className="mx-auto grid h-16 max-w-lg grid-cols-4">
        <Link href="/" className="flex flex-col items-center justify-center gap-1 text-white/70 transition hover:text-white">
          <Home size={19} aria-hidden="true" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <button
          type="button"
          onClick={() => {
            setExploreOpen((open) => !open)
            setNavHidden(false)
          }}
          className="flex flex-col items-center justify-center gap-1 text-white/70 transition hover:text-white"
          aria-label="Explore"
          aria-expanded={exploreOpen}
        >
          <Compass size={19} aria-hidden="true" />
          <span className="text-[10px] font-medium">Explore</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setButton((open) => !open)
            setNavHidden(false)
          }}
          className="flex flex-col items-center justify-center gap-1 text-white/70 transition hover:text-white"
          aria-label="Search"
        >
          <SearchIcon size={19} aria-hidden="true" />
          <span className="text-[10px] font-medium">Search</span>
        </button>
        <Link href="/collection" className="flex flex-col items-center justify-center gap-1 text-white/70 transition hover:text-white">
          <Bookmark size={19} aria-hidden="true" />
          <span className="text-[10px] font-medium">Collection</span>
        </Link>
      </div>
      {exploreOpen && (
        <div className="absolute inset-x-4 bottom-full mb-2 rounded-xl border border-white/15 bg-black/95 p-2 shadow-xl backdrop-blur-xl sm:hidden">
          <Link
            href="/explore/country"
            onClick={() => setExploreOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-white/85 transition hover:bg-white/10 hover:text-white"
          >
            <Globe2 size={18} aria-hidden="true" /> Countries
          </Link>
          <Link
            href="/explore/genre"
            onClick={() => setExploreOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-white/85 transition hover:bg-white/10 hover:text-white"
          >
            <Shapes size={18} aria-hidden="true" /> Genres
          </Link>
        </div>
      )}
    </nav>
    </>
  )
}

export default Navbar
