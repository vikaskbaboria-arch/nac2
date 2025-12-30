"use client"
import { useEffect, useState,useRef } from 'react'
import Reviewdata from './Reviewdata'
import { fetchMovies } from '@/lib/masterfetch'
import Image from 'next/image'
import { submitReview } from '@/lib/fetchr'
import { fetchCredit } from '@/fetch/credit'
import { fetchdata } from '@/fetch/fetchdata'
import ReviewForm from './ReviewForm'
import { Slice } from 'lucide-react'
  const Result = ( movies) => {
   const castRef = useRef(null);

const scrollLeft = () => {
  castRef.current?.scrollBy({ left: -680, behavior: "smooth" });
};

const scrollRight = () => {
  castRef.current?.scrollBy({ left: 680, behavior: "smooth" });
};
   console.log(movies.movie)
   const [movie,setMovie]=useState(null)
   const[rev,setRev]=useState(null)
   const [showFullOverview, setShowFullOverview] = useState(false);

   const[credits,setCredits] =useState(null)
  //  const[streamer,setStreamer]=useState(null)
useEffect(() => {
  async function loadData() {
    const movieData = await fetchMovies({
      type: "byid",
      id: movies.movie,
      type_of: "movie",
    });

    setMovie(movieData);

    const creditsData = await fetchCredit(movieData.id, "movie");
    setCredits(creditsData);
    // setStreamer(movies.streamer)
  }

  loadData();
}, [movies.movie]);

console.log(movies.movie)
// console.log(movie?.id)
// useEffect(() => {
//   if (!movie?.id) return;

//   fetchCredit(movie.id, "movie").then(setCredits);
// }, [movie]);

// useEffect(()=>{
// submitReview({mid:1336189,rt:"hello i love this movue",rat:10})
// .then((m)=>(setRev(m)))
// },[setRev,movie])
// console.log(rev)
  //  console.log(movie)
  console.log(movie)
  console.log(credits)
 console.log(movies.streamer)
 console.log(movies.streamer?.results?.US?.flatrate)
 const india =movies.streamer?.results?.IN;
 const flatrate = india?.flatrate || []
 const poster =`https://image.tmdb.org/t/p/w780/`+movie?.poster_path
 const cover = `https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces/${movie?.backdrop_path}`;
 console.log(poster)


  return (
 < >


 {/* <div className='text-white'>movie:{movie?.results?.[0]?.title}</div> */}
<div className="text-white">
  <div className="cover mx-auto max-w-full transition duration-500">
    
    {/* HERO CONTAINER */}
    <div className="relative  min-h-[420px] md:min-h-[600px] bg-black overflow-hidden">

      {/* BACKDROP */}
      <img
        className="absolute hidden sm:flex  inset-0  h-full object-cover  sm:w-full opacity-40"
        src={cover}
        alt=""
      />

      {/* RATING */}
      <div className="absolute top-4 right-4 px-3 h-7 flex items-center bg-purple-500 text-white rounded font-bold z-10">
        ⭐ {movie?.vote_average}
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col md:flex-row gap-6 px-4 sm:px-8 pt-24">

        {/* POSTER */}
        <img
          className="
            w-36 sm:w-48 md:w-64
            rounded-lg shadow-2xl
            object-cover
            mx-auto md:mx-0
          "
          src={poster}
          alt=""
        />

        {/* DETAILS */}
        <div
          className="
            w-full md:w-1/2
            p-2 sm:p-4 md:p-6
            flex flex-col gap-4
            text-center md:text-left
          "
        >
          <span className="text-2xl sm:text-3xl font-bold">
            {movie?.title || movie?.name}
          </span>

    <div className="over flex flex-col gap-3">

  <span className="text-slate-400 font-bold">
    Overview
  </span>

  {/* OVERVIEW TEXT */}
  <p
    className={`
      text-gray-200 leading-relaxed
      ${showFullOverview ? "" : "line-clamp-3"}
      md:line-clamp-none
      transition-all duration-300
    `}
  >
    {movie?.overview}
  </p>

  {/* TOGGLE BUTTON (ONLY MOBILE) */}
  {movie?.overview?.length > 120 && (
    <button
      onClick={() => setShowFullOverview(!showFullOverview)}
      className="md:hidden text-purple-400 text-sm font-semibold self-start"
    >
      {showFullOverview ? "Show less" : "Show more"}
    </button>
  )}

</div>


          {/* CREDITS */}
          <div className="flex flex-wrap gap-6 mt-4 justify-center md:justify-between">
            <div>Director</div>
            <div>Producer</div>
            <div>Writer</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

<div className="max-w-[90vw] mx-auto px-4 mt-10 flex flex-col lg:flex-row gap-8">

  {/* LEFT: CAST SECTION */}
  <div className="relative w-full lg:w-2/3">
          <h3 className="text-white text-xl font-semibold mb-4">Cast</h3>

  {/* LEFT BUTTON */}
  <button
    onClick={scrollLeft}
   className="
      absolute -left-12 top-42 h-56  -translate-y-1/2 z-10 w-12
      bg-black/20 hover:bg-black/40
      text-white p-2 flex items-center justify-center
       hidden sm:flex 
    "
  >
    <img src="/left.svg" alt="" />
  </button>

  {/* CAST SCROLL AREA */}
  <div
    ref={castRef} 
    className="flex   gap-4 sm:gap-6 overflow-x-auto py-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
    {credits?.cast?.slice(0, 10).map((m) => (
      <div
        key={m.id}
        className="flex-shrink-0 w-24 sm:w-32 md:w-36 hover:scale-105 transition"
      >
        <div className="aspect-[2/3] rounded-md overflow-hidden bg-gray-800">
          <img
            src={
              m.profile_path
                ? `https://image.tmdb.org/t/p/w185${m.profile_path}`
                : "/avatar.png"
            }
            alt={m.name}
            className="w-full h-full object-cover"
          />
        </div>

        <p className="mt-2 text-[10px] sm:text-xs font-semibold text-center text-white truncate">
          {m.name}
        </p>
      </div>
    ))}
  </div>

  {/* RIGHT BUTTON */}
 
      <button
    onClick={scrollRight}
    className=" 
      absolute -right-12 top-42 h-56  -translate-y-1/2 z-10 w-12
      bg-black/20 hover:bg-black/40
      text-white p-2 flex items-center justify-center
       hidden sm:flex
    "
  >
    <img src="/right.svg" alt="" />
    
  </button>
 
</div>



  {/* RIGHT: STREAMING INFO */}
 <div className="w-full lg:w-[32%] bg-black/40 rounded-lg p-5">
          <h3 className="text-white text-lg font-semibold mb-4">Watch on</h3>

          {movies.streamer?.results?.IN?.flatrate?.length > 0 ? (
            <div className="flex flex-col gap-3">
              {movies.streamer?.results?.IN?.flatrate?.map((p) => (
                <div
                  key={p.provider_id}
                  className="flex items-center gap-4 bg-gray-900 hover:bg-gray-800 p-3 rounded-md transition"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                    alt={p.provider_name}
                    className="w-10 h-10 rounded-md"
                  />
                  <span className="text-gray-200 font-semibold">
                    {p.provider_name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              Not available for streaming in your region
            </p>
          )}

          <p className="text-gray-500 text-xs mt-4">
            Availability may vary by region
          </p>
        </div>
      </div>



<div className='w-full   '>
  <ReviewForm movieId={movie?.id} onSuccess={(r)=>setRev(r)} />
</div>
<div className=' w-full'>
  <Reviewdata  movieId={movie?.id} />
</div>

 {/* {pages>1?(<Pagen movie={movie} />):<p>page:1</p>} */}
 </>
  )
  }
  export default Result