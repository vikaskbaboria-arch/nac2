"use client"
import { useEffect, useState ,useRef } from 'react'
import Reviewdata from './Reviewdata'
import { fetchMovies } from '@/lib/masterfetch'
import { submitReview } from '@/lib/fetchr'
import { fetchCredit } from '@/fetch/credit'
import { fetchdata } from '@/fetch/fetchdata'
import ReviewForm from './ReviewForm'
import { Slice } from 'lucide-react'
  const SeriesR = ( movies) => {
    const castRef = useRef(null);
    const scrollLeft = () => {
  castRef.current?.scrollBy({ left: -300, behavior: "smooth" });
};

const scrollRight = () => {
  castRef.current?.scrollBy({ left: 300, behavior: "smooth" });
};
   console.log(movies.movie)
   const [movie,setMovie]=useState(null)
   const[rev,setRev]=useState(null)
   const[credits,setCredits] =useState(null)
useEffect(() => {
 fetchMovies({type:"byid",id:movies.movie ,type_of:"tv"})
 .then((m)=>(setMovie(m)))
    async function loaddata(params) {
          const creditsData = await fetchCredit(movieData.id, "movie");
    setCredits(creditsData);
    }
 
}, [movies])
console.log(movies.movie)
// console.log(movie?.id)
useEffect(() => {
  if (!movie?.id) return;

  fetchCredit(movie.id, "tv").then(setCredits);
}, [movie]);

// useEffect(()=>{
// submitReview({mid:1336189,rt:"hello i love this movue",rat:10})
// .then((m)=>(setRev(m)))
// },[setRev,movie])
// console.log(rev)
  //  console.log(movie)
  console.log(movie)
  console.log(credits)

 const poster =`https://image.tmdb.org/t/p/w780/`+movie?.poster_path
 const cover = `https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces/${movie?.backdrop_path}`;
 console.log(poster)


  return (
 < >


 {/* <div className='text-white'>movie:{movie?.results?.[0]?.title}</div> */}
<div className='text-white '>


<div className=" cover object-contain  border-slate-600    box-border  mx-auto   max-w-[1920px]  transform   transition duration-500   "> 
   
   <div className=" relative h-[600px] pb-[260px] bg-black overflow-hidden">
       <img className='object-cover h-[670px]   opacity-25  w-full  '  src={`${cover}`}  alt="" />
<div className="absolute top-6 px-2 w-24 font-bold h-7 text-center flex items-center right-8 bg-purple-500 text-white px-2 rounded">⭐{movie?.vote_average} </div>

<img className='absolute w-64 md:w-72 rounded-lg shadow-2xl object-cover top-25  left-[30]  ' src={`${poster}
`}  alt="" />



<div className=' absolute w-1/2  p-6  left-86 top-26   flex flex-col gap-5 '>
<div className="title text-3xl font-bold">
  
</div>
 
  
 <div className="over flex flex-col gap-4">
   <span className='font-bold text-2xl '>{movie?.title ||movie?.name}</span>
   <span className='text-slate-400 font-bold'>
     overview
 
  </span>
  <span className='text-gray-200'>
    {movie?.overview}
  </span>
 </div>
 <div className="credits flex justify-between">
   <div className="director">
      Director
   </div>
    <div className="Producer">
      Director
   </div>
    <div className="writer">
      Director
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
  export default SeriesR