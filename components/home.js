"use client"
import React, { useEffect, useState, useRef } from 'react'
import { fetchMovies } from '@/lib/masterfetch'

import { useRouter } from 'next/navigation'
export default function HomeCarousel() {
  const [slides, setSlides] = useState([])
  const [currentIndex, setCurrentIndex] = useState(1) // 1 == first real slide
  const [paused, setPaused] = useState(false)
  const containerRef = useRef(null)
  const trackRef = useRef(null)
   const router =useRouter()
  const transitionMs = 600
  const [slideWidth, setSlideWidth] = useState(900)
  const[data,setData]=useState(null)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetchMovies({ type: 'trending',type_of:"all"})
        const items = (res?.results || []).slice(0, 6)
        
        if (!mounted) return
        setSlides(items)
        setCurrentIndex(1)
      } catch (err) {
        console.error('HomeCarousel fetch failed', err)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const extended = slides.length ? [slides[slides.length - 1], ...slides, slides[0]] : []


  // fetch ratings for slides


  // measure slide width
  const getSlideWidth = () => containerRef.current?.clientWidth || 900

  // apply transform when currentIndex changes
  useEffect(() => {
    const track = trackRef.current
    if (!track || !extended.length) return
    const w = getSlideWidth()
    track.style.transition = `transform ${transitionMs}ms ease`
    track.style.transform = `translateX(-${currentIndex * w}px)`

    // if moved to cloned ends, jump after transition
    let t
    if (currentIndex === 0) {
      t = setTimeout(() => {
        track.style.transition = 'none'
        setCurrentIndex(extended.length - 2)
        // force reflow then restore transition
        setTimeout(() => {
          if (track) track.style.transition = `transform ${transitionMs}ms ease`
        }, 20)
      }, transitionMs)
    } else if (currentIndex === extended.length - 1) {
      t = setTimeout(() => {
        track.style.transition = 'none'
        setCurrentIndex(1)
        setTimeout(() => {
          if (track) track.style.transition = `transform ${transitionMs}ms ease`
        }, 20)
      }, transitionMs)
    }
    return () => {
      if (t) clearTimeout(t)
    }
  }, [currentIndex, extended.length])

  // auto advance
  useEffect(() => {
    if (!slides.length) return
    const id = setInterval(() => {
      if (!paused) setCurrentIndex((i) => i + 1)
    }, 3500)
    return () => clearInterval(id)
  }, [paused, slides.length])

  const next = () => setCurrentIndex((i) => i + 1)
  const prev = () => setCurrentIndex((i) => i - 1)
    // update slideWidth on mount / resize
    useEffect(() => {
      const update = () => setSlideWidth(getSlideWidth())
      update()
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }, [])
  useEffect(() => {
    const onResize = () => {
      const track = trackRef.current
      if (!track) return
      const w = slideWidth
      track.style.transition = 'none'
      track.style.transform = `translateX(-${currentIndex * w}px)`
      setTimeout(() => {
        if (track) track.style.transition = `transform ${transitionMs}ms ease`
      }, 20)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [currentIndex])



  const handleCick=((m)=>{
       if(m.media_type==="movie"){
    router.push(`/movie/${m?.id}`);}
   else{
    router.push(`/series/${m.id}`);
   }
  })

  return (
    <div className="px-12 my-8">
      <div className="flex items-center justify-between gap-4">
        <button aria-label="prev" onClick={prev} className="px-3 hidden sm:flex  text-white py-2 bg-slate-900 rounded">{'<'}</button>

        <div
          ref={containerRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="w-full max-w-[1200px]  mx-auto overflow-hidden rounded-md"
        
        >
          {slides.length === 0 ? (
            <div className="w-full h-[20vh] md:h-[50vh] lg:h-[60vh] flex items-center justify-center bg-gradient-to-tr from-gray-900  to-purple-900 text-white font-bold text-xl">No slides available</div>
          ) : (
            <div
              ref={trackRef}
              className="flex"
              style={{ width: `${extended.length * slideWidth}px`, wil2lChange: 'transform' }}
            >
              {extended.map((m, idx) => (
                <div key={idx}
                  onClick={()=>(handleCick(m))}
                className="flex-shrink-0 p-2" style={{ width: `${slideWidth}px` }}>
                  <div className="h-[20vh] md:h-[50vh] lg:h-[60vh] relative rounded-lg overflow-hidden border-2 border-purple-950">
                    <img src={`https://image.tmdb.org/t/p/w1280/${m.backdrop_path}`} alt={m?.title } className="w-full h-full object-cover" />
                    <div className="absolute bottom-1.5 left-2 sm:left-4 sm:bottom-6 text-white font-semibold sm:text-3xl">{m?.title || m?.name}</div>
                    <div className="absolute top-2 sm:top-4  w-14 h-4 right-2 sm:right-4 text-xs bg-green-700 text-white px-2 rounded flex items-center justify-center"> 
                  {m?.vote_average}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button aria-label="next" onClick={next} className="px-3 hidden sm:flex py-2 bg-slate-900 text-white rounded">{'>'}</button>
      </div>
    </div>
  )
}

