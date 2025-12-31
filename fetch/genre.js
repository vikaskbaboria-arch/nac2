export const fetchgenere=async(genre,type)=>{
    console.log(genre)
    const data = await fetch(`https://api.themoviedb.org/3/discover/${type}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&with_genres=${genre}`,{ next: { revalidate: 3600 } })
    const res = await data.json()
    return res
   
}
export const generename = async ({ type = "movie" } = {}) => {
  console.log(type);

  const res = await fetch(
    `https://api.themoviedb.org/3/genre/${type}/list?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
  );

  return await res.json();
};


export const getGenreNames=async (genreId)=> {
    const data = await  generename()
   const genre = data?.genres?.find((element) => element.id===genreId
     
    //  element.id===genreIds && console.log(element.name)

  );
  return genre?.name
}
// export const fetchgenere = async (genre) => {
//   const data = await fetch(
//     `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&with_genres=${genre}`
//   );
//   const res = await data.json();
//   return res;
// };

// export const generename = async () => {
//   const res = await fetch(
//     `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
//   );
//   const data = await res.json();
//   return data;
// };

// export const getGenreNames = async (genreId) => {
//   const data = await generename();

//   const genre = data?.genres?.find(
//     (element) => element.id === genreId   // ✅ FIXED
//   );

//   return genre?.name;
// };
