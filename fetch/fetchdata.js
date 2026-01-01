export const fetchdata = async (movie) => {
    const q = encodeURIComponent(movie);
    const data = await fetch(`/api/tmdb/search/movie?query=${q}`, { next: { revalidate: 3600 } });
    const res = await data.json();
    return res;
};
