export const fetchgenere = async (genre) => {
  const res = await fetch(`/api/tmdb/discover/movie?with_genres=${genre}`);
  return await res.json();
};

export const generename = async () => {
  const res = await fetch(`/api/tmdb/genre/movie/list`);
  const data = await res.json();
  return data;
};

export const getGenreNames = async (genreId) => {
  const data = await generename();

  const genre = data?.genres?.find(
    (element) => element.id === genreId   // ✅ FIXED
  );

  return genre?.name;
};
