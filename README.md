# 🎬 NAC 2 — Movie & Series Discovery Platform

**NAC 2** is a modern movie and TV-series discovery platform built with **Next.js** and powered by **TMDB**. It allows users to discover movies and series, explore content by country and genre, view ratings and details, and find where content is available to watch.

The project is designed with a **premium dark UI** inspired by modern streaming platforms while providing a more discovery and review-focused experience.

My love for cinema, movies, and TV series inspired me to build this platform in a thoughtful and premium way, so that discovering great stories feels as exciting as watching them.

---

## ✨ Features

### 🎥 Movie & Series Discovery

* Discover movies and TV series
* Popular and top-rated content
* Trending content
* Search for movies, series, and people
* Explore content by:

  * Country
  * Language
  * Genre
  * Release year
  * Rating
  * Content type

### 🌍 Country Exploration

Browse content based on its country of origin.

Example:

```text
/explore/country/in
/explore/country/us
/explore/country/jp
```

Country pages support:

* Movies
* TV/Series
* Language filtering
* Sorting
* Pagination

### 🔎 Advanced Filters

NAC 2 provides filtering options such as:

* Sort by newest
* Sort by oldest
* Top rated
* A–Z
* Movies
* Shows
* Country
* Language
* Streaming providers

### 📺 Streaming Providers

The platform can use TMDB watch-provider data to identify streaming platforms where content is available.

Supported providers can include platforms such as:

* Netflix
* Prime Video
* JioHotstar
* SonyLIV
* Zee5
* Crunchyroll
* Apple TV+
* YouTube

### ⭐ Reviews & Ratings

Users can explore movie and series ratings and reviews.

The project is intended to provide a more community-driven experience around discovering and discussing movies and series.

### 🎞️ Movie & Series Details

Each title can provide information such as:

* Poster
* Title
* Overview
* Release date
* Rating
* Genres
* Cast
* Crew
* Streaming providers
* Reviews

### 🎨 Modern UI

NAC 2 uses a dark, cinematic interface with:

* Responsive layouts
* Animated UI elements
* Hover effects
* Shiny text effects
* Movie poster grids
* Filter panels
* Responsive navigation
* Premium streaming-style design

---

# 🛠️ Tech Stack

## Frontend

* **Next.js**
* **React**
* **Tailwind CSS**
* **Framer Motion**
* **Lucide React**

## Backend / APIs

* **Next.js API Routes**
* **TMDB API**

## Database

Depending on the feature:

* MongoDB
* Mongoose

## Authentication

* NextAuth

## External Services

* TMDB
* Streaming provider data through TMDB
* Cloudinary for media uploads where applicable

---

# 📁 Project Structure

A simplified structure of NAC 2:

```text
nac2/
│
├── app/
│   ├── api/
│   │   └── tmdb/
│   │
│   ├── explore/
│   │   ├── country/
│   │   └── ...
│   │
│   ├── movie/
│   │   └── [moviename]/
│   │
│   ├── search/
│   │
│   ├── page.js
│   └── layout.js
│
├── components/
│   ├── ui/
│   └── ...
│
├── lib/
│   ├── masterfetch.js
│   ├── localeNames.js
│   └── ...
│
├── public/
│
├── styles/
│
├── package.json
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd nac2
```

## 2. Install dependencies

Using npm:

```bash
npm install
```

Or:

```bash
yarn install
```

```bash
pnpm install
```

```bash
bun install
```

---

# 🔐 Environment Variables

Create a `.env.local` file in the root of the project.

Example:

```env
TMDB_API_KEY=your_tmdb_api_key

MONGODB_URI=your_mongodb_connection_string

NEXTAUTH_SECRET=your_nextauth_secret

NEXTAUTH_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Only add the variables required by the features enabled in your local setup.

---

# ▶️ Run the Development Server

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

The application will automatically update when you modify the source code.

---

# 🎬 TMDB Integration

NAC 2 uses **The Movie Database (TMDB)** for movie and TV metadata.

The project uses a centralized fetching layer:

```text
lib/masterfetch.js
```

This helps keep TMDB requests consistent throughout the application.

Examples of supported operations include:

```text
Popular
Top Rated
Trending
Search
Discover
Movie Details
TV Details
Streaming Providers
```

---

# 🌎 Country Discovery

Country discovery uses ISO country codes.

For example:

```text
IN → India
US → United States
GB → United Kingdom
JP → Japan
KR → South Korea
```

Example route:

```text
/explore/country/in
```

The country page can use TMDB's origin-country filtering to retrieve content associated with that country.

---

# 📺 Series Discovery

NAC 2 treats TMDB's `tv` media type as series/TV content.

For streaming-focused discovery, provider information can also be used to narrow results to titles available through streaming platforms in a particular region.

For example:

```text
Country: IN
Watch Region: IN
Media Type: TV
Provider: Netflix
```

---

# 🔍 Search

The search system can search across TMDB content and support different media types.

Depending on the page, results can include:

```text
Movies
TV Shows
People
```

Filters can then be applied to the returned results.

---

# 🧩 Filters

The filter system is designed as a reusable component.

Example:

```jsx
<Filters
  onFilterChange={setFilters}
  types={COUNTRY_PAGE_TYPES}
  showCountryFilter={false}
/>
```

Available filtering state includes:

```js
{
  sort,
  type,
  country,
  language,
  providers,
  moctaleSelect,
  familyFriendly
}
```

---

# 📄 Pagination

Country and discovery pages support pagination.

Example:

```text
/explore/country/in?page=1
```

Changing the page updates the URL:

```text
/explore/country/in?page=2
/explore/country/in?page=3
```

---

# 🎨 Design Philosophy

NAC 2 focuses on a cinematic and premium interface.

The design direction includes:

* Dark backgrounds
* Large movie artwork
* Rounded cards
* Subtle borders
* Glassmorphism
* Smooth animations
* Responsive layouts
* Minimal visual clutter

The goal is to make discovering movies and series feel closer to using a modern streaming application while retaining the functionality of a movie discovery/review platform.

---

# 🧪 Development

Start development with:

```bash
npm run dev
```

Build the application:

```bash
npm run build
```

Run the production server:

```bash
npm start
```

Run linting:

```bash
npm run lint
```

---

# 🐛 Troubleshooting

### TMDB requests return 401

Check that your TMDB API credentials are configured correctly.

### TMDB requests return 500

Check the server-side TMDB proxy/API route and inspect the terminal logs.

### Country results are incorrect

Make sure country codes are uppercase when passed to TMDB:

```js
const countryCode = country?.toUpperCase();
```

For example:

```text
in → IN
us → US
jp → JP
```

### TV results contain traditional TV serials

TMDB's `tv` category includes both traditional television programs and streaming/web series.

Use streaming-provider filters when you specifically want streaming-focused results.

---

# 🚧 Future Improvements

Planned improvements for NAC 2 may include:

* Personalized recommendations
* User watchlists
* Advanced review system
* User profiles
* Follow system
* Social interactions
* Better recommendation algorithms
* More detailed streaming availability
* Personalized home page
* Improved country discovery
* Improved series/web-series filtering
* Notifications
* Performance optimization
* Better caching
* Infinite scrolling
* More advanced search

---

# 📌 Project Goal

NAC 2 aims to become a complete **movie and series discovery platform** where users can:

```text
Discover
   ↓
Explore
   ↓
Compare
   ↓
Find where to watch
   ↓
Review
   ↓
Build their watchlist
```

The focus is on combining **movie discovery, streaming availability, reviews, and a modern social experience** into one platform.

---

## 📜 License

This project is currently intended for development and educational purposes.

Movie and TV metadata is provided through TMDB.

NAC 2 is not affiliated with or endorsed by TMDB.

---

## 👨‍💻 Development

Built with ❤️ using:

**Next.js + React + Tailwind CSS + TMDB + MongoDB**
