export const GENRES = [
  { slug: "action", name: "Action", id: 28 },
  { slug: "adventure", name: "Adventure", id: 12 },
  { slug: "animation", name: "Animation", id: 16 },
  { slug: "comedy", name: "Comedy", id: 35 },
  { slug: "crime", name: "Crime", id: 80 },
  { slug: "documentary", name: "Documentary", id: 99 },
  { slug: "drama", name: "Drama", id: 18 },
  { slug: "family", name: "Family", id: 10751 },
  { slug: "fantasy", name: "Fantasy", id: 14 },
  { slug: "history", name: "History", id: 36 },
  { slug: "horror", name: "Horror", id: 27 },
  { slug: "music", name: "Music", id: 10402 },
  { slug: "mystery", name: "Mystery", id: 9648 },
  { slug: "romance", name: "Romance", id: 10749 },
  { slug: "science-fiction", name: "Science Fiction", id: 878 },
  { slug: "tv-movie", name: "TV Movie", id: 10770 },
  { slug: "thriller", name: "Thriller", id: 53 },
  { slug: "war", name: "War", id: 10752 },
  { slug: "western", name: "Western", id: 37 },
];

export const getGenreBySlug = (slug) =>
  GENRES.find((genre) => genre.slug === slug?.toLowerCase());