export const fetchgenere = async (genre, type) => {
  const data = await fetch(`/api/tmdb/discover/${type}?with_genres=${genre}`, { next: { revalidate: 3600 } });
  const res = await data.json();
  return res;
};
export const generename = async ({ type = "movie" } = {}) => {
  console.log(type);

  const res = await fetch(`/api/tmdb/genre/${type}/list`);
  return await res.json();
};


export const getGenreNames=async (genreId)=> {
    const data = await  generename()
   const genre = data?.genres?.find((element) => element.id===genreId
     
    //  element.id===genreIds && console.log(element.name)

  );
  return genre?.name
}
