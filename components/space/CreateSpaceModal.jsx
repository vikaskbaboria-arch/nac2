"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  X,
  Search,
  Check,
  HelpCircle,
  AlertTriangle,
  FileText,
  Video,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Film,
  CheckCircle2,
  Bookmark,
  MessageSquare,
  Newspaper,
  Save,
} from "lucide-react";
import { fetchMovies } from "@/lib/masterfetch";
import { getTrailerUrl } from "@/lib/gettrailer";

/**
 * Normalizes YouTube URLs or IDs into safe iframe embed format
 */
function getYouTubeEmbedUrl(input) {
  if (!input) return "";
  const trimmed = input.trim();
  if (trimmed.includes("youtube.com/embed/")) {
    return trimmed;
  }
  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?mute=0&controls=1`;
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}?mute=0&controls=1`;
  }
  return trimmed;
}

const STEPS = [
  { id: "movie_search", label: "Title Check", icon: Search },
  { id: "space_type", label: "Space Type", icon: Layers },
  { id: "main_content", label: "Main Content", icon: FileText },
  { id: "trailers", label: "Trailers & Media", icon: Video },
  { id: "review", label: "Review & Publish", icon: CheckCircle2 },
];

export default function CreateSpaceModal({ isOpen, onClose, onSuccess }) {
  const { data: session } = useSession();

  // Wizard Step index (0 to 4)
  const [currentStep, setCurrentStep] = useState(0);

  // Form Fields
  const [spaceType, setSpaceType] = useState("discussion"); // 'discussion' | 'trailer' | 'news'
  const [postTitle, setPostTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // Movie Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [autoLoadingTrailer, setAutoLoadingTrailer] = useState(false);

  // Submit states
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [draftSaved, setDraftSaved] = useState(false);

  // Live debounced TMDB search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }

    let isMounted = true;
    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const data = await fetchMovies({
          type: "search",
          type_of: "multi",
          query: searchQuery.trim(),
        });

        if (!isMounted) return;

        const items = (data?.results || []).filter(
          (m) =>
            (m.media_type === "movie" || m.media_type === "tv") &&
            (m.title || m.name)
        );
        setSuggestions(items.slice(0, 7));
      } catch (err) {
        console.error("Movie search error:", err);
        if (isMounted) setSuggestions([]);
      } finally {
        if (isMounted) setLoadingSuggestions(false);
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Handle movie selection
  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setSearchQuery("");
    setSuggestions([]);
    setFormError(null);

    // If trailer type or user switches to trailer, auto-fetch official trailer
    setAutoLoadingTrailer(true);
    getTrailerUrl(movie.id, movie.media_type || "movie")
      .then((trailer) => {
        if (trailer && !videoUrl) {
          setVideoUrl(trailer);
        }
      })
      .finally(() => setAutoLoadingTrailer(false));
  };

  const handleClearMovie = () => {
    setSelectedMovie(null);
    setSearchQuery("");
  };

  const handleSaveDraft = () => {
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const handleNext = () => {
    setFormError(null);
    if (currentStep === 0 && !selectedMovie) {
      setFormError("Please search and select a movie or series first.");
      return;
    }
    if (currentStep === 2 && !content.trim()) {
      setFormError("Please write your dispatch content.");
      return;
    }
    if (currentStep === 3 && spaceType === "trailer" && !videoUrl.trim()) {
      setFormError("Please enter a valid YouTube video link for the trailer.");
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((c) => c + 1);
    }
  };

  const handleBack = () => {
    setFormError(null);
    if (currentStep > 0) {
      setCurrentStep((c) => c - 1);
    }
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (!session) {
      setFormError("Please sign in to publish this dispatch.");
      return;
    }

    if (!selectedMovie) {
      setFormError("Please select a movie first.");
      return;
    }

    if (!content.trim()) {
      setFormError("Please provide dispatch content.");
      return;
    }

    const embed = spaceType === "trailer" ? getYouTubeEmbedUrl(videoUrl) : null;
    if (spaceType === "trailer" && !embed) {
      setFormError("A valid YouTube trailer video link is required.");
      return;
    }

    setSubmitting(true);

    try {
      const posterPath = selectedMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
        : null;

      const backdropPath = selectedMovie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`
        : null;

      const payload = {
        spaceType,
        movieId: selectedMovie.id,
        movieTitle: selectedMovie.title || selectedMovie.name,
        title:
          postTitle.trim() ||
          selectedMovie.title ||
          selectedMovie.name ||
          "Cinema Dispatch",
        content: content.trim(),
        img: posterPath,
        backdrop: backdropPath,
        video: embed,
      };

      const res = await fetch("/api/space", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || "Failed to publish dispatch");
      } else {
        // Success
        onSuccess?.(data.space);
        onClose();
      }
    } catch (err) {
      console.error("Failed to submit dispatch:", err);
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const activeStepConfig = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* Backdrop Click Dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* MODAL WRAPPER (Matches screenshot layout styling) */}
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[720px] bg-[#09090b] border border-white/10 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden z-10 text-white">

        {/* ============================================================== */}
        {/* LEFT COLUMN: Steps & Progress (Matches screenshot)             */}
        {/* ============================================================== */}
        <aside className="w-full md:w-64 xl:w-72 bg-[#050507] border-b md:border-b-0 md:border-r border-white/10 p-5 sm:p-6 flex flex-col justify-between shrink-0">
          <div>
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                Add Content
              </h3>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">
                0{currentStep + 1} / 0{STEPS.length} Contributions
              </p>
            </div>

            {/* Vertical Steps Navigation */}
            <nav className="space-y-1.5" aria-label="Contribution Steps">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isActive = currentStep === idx;
                const isPassed = currentStep > idx;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      if (idx <= currentStep || selectedMovie) {
                        setCurrentStep(idx);
                      }
                    }}
                    className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? "bg-[#222225] text-white shadow-sm font-semibold"
                        : isPassed
                        ? "text-zinc-300 hover:text-white hover:bg-white/5"
                        : "text-zinc-500 hover:text-zinc-400 hover:bg-white/5"
                    }`}
                  >
                    <Icon
                      size={17}
                      className={isActive ? "text-purple-400" : isPassed ? "text-emerald-400" : "text-zinc-500"}
                    />
                    <span className="truncate">{step.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Progress Bar */}
          <div className="pt-6 border-t border-white/5 mt-4">
            <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase text-zinc-400 mb-2">
              <span>PROGRESS</span>
              <span>{currentStep + 1}/{STEPS.length}</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </aside>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: Active Form Step & Actions                       */}
        {/* ============================================================== */}
        <div className="flex-1 flex flex-col justify-between bg-[#0a0a0d] overflow-hidden">

          {/* TOP BAR: Title & Actions (Matches screenshot) */}
          <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                {selectedMovie ? (selectedMovie.title || selectedMovie.name) : "Untitled Content"}
              </h2>
              <p className="text-xs text-zinc-400">{activeStepConfig.label}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-zinc-300 font-medium transition cursor-pointer"
              >
                <Save size={13} />
                <span>{draftSaved ? "Saved" : "Draft"}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* MAIN SCROLLABLE FORM BODY */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 custom-scroll space-y-6">

            {/* ------------------------------------------------------------ */}
            {/* STEP 0: TITLE CHECK (Live Search without needing year)       */}
            {/* ------------------------------------------------------------ */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-2">
                    TITLE NAME <span className="text-purple-400">*</span>
                  </label>

                  {/* Search Input with Instant Dropdown Suggestions */}
                  <div className="relative">
                    <div className="relative flex items-center">
                      <Search
                        size={17}
                        className="absolute left-4 text-zinc-400 pointer-events-none"
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search movie or series (e.g. Inception, Farzi, Dune)..."
                        className="w-full bg-[#121215] border border-white/15 focus:border-purple-500 rounded-2xl pl-11 pr-10 py-3 text-sm text-white placeholder-zinc-500 outline-none transition"
                      />
                      {loadingSuggestions && (
                        <div className="absolute right-3.5">
                          <RefreshCw size={16} className="text-purple-400 animate-spin" />
                        </div>
                      )}
                    </div>

                    {/* LIVE SEARCH RESULTS DROPDOWN */}
                    {suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-[#141419] border border-white/15 rounded-2xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto divide-y divide-white/5">
                        {suggestions.map((item) => {
                          const title = item.title || item.name;
                          const year = (item.release_date || item.first_air_date)?.slice(0, 4);
                          const poster = item.poster_path
                            ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                            : "/placeholder.png";

                          return (
                            <div
                              key={item.id}
                              onClick={() => handleSelectMovie(item)}
                              className="flex items-center gap-3 p-2.5 hover:bg-white/10 cursor-pointer transition"
                            >
                              <img
                                src={poster}
                                alt=""
                                className="w-9 h-13 rounded-lg object-cover bg-zinc-800 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm text-white truncate">
                                    {title}
                                  </span>
                                  {year && (
                                    <span className="text-xs text-zinc-400 shrink-0">
                                      ({year})
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 uppercase font-medium">
                                    {item.media_type === "tv" ? "Series" : "Movie"}
                                  </span>
                                  {item.vote_average > 0 && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                                      ★ {item.vote_average?.toFixed(1)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="text-xs text-purple-400 font-medium shrink-0 flex items-center gap-1">
                                Select <ArrowRight size={13} />
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* VERIFIED SELECTED MOVIE SHOWCASE CARD */}
                {selectedMovie ? (
                  <div className="rounded-3xl overflow-hidden border border-purple-500/40 bg-[#121216] shadow-xl relative animate-scaleIn">
                    {selectedMovie.backdrop_path && (
                      <div className="relative h-32 w-full overflow-hidden">
                        <img
                          src={`https://image.tmdb.org/t/p/w1280${selectedMovie.backdrop_path}`}
                          alt=""
                          className="w-full h-full object-cover object-center filter brightness-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-[#121216]/60 to-transparent" />
                      </div>
                    )}
                    <div className="p-4 flex items-center justify-between gap-4 relative z-10 -mt-10 sm:-mt-12">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={
                            selectedMovie.poster_path
                              ? `https://image.tmdb.org/t/p/w185${selectedMovie.poster_path}`
                              : "/placeholder.png"
                          }
                          alt=""
                          className="w-14 h-20 rounded-xl object-cover border border-white/20 shadow-xl shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 size={12} /> Poster & Backdrop Captured
                          </span>
                          <h4 className="text-base font-bold text-white truncate mt-0.5">
                            {selectedMovie.title || selectedMovie.name}
                          </h4>
                          <p className="text-xs text-zinc-400">
                            {(selectedMovie.release_date || selectedMovie.first_air_date)?.slice(0, 4)} •{" "}
                            {selectedMovie.media_type === "tv" ? "TV Series" : "Movie"} • TMDB ★{" "}
                            {selectedMovie.vote_average?.toFixed(1)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleClearMovie}
                        className="text-xs text-zinc-300 font-semibold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition shrink-0 cursor-pointer"
                      >
                        Change Title
                      </button>
                    </div>
                  </div>
                ) : (
                  searchQuery.trim().length > 1 && !loadingSuggestions && suggestions.length === 0 && (
                    <p className="text-xs text-zinc-500 px-1">
                      No results found for &ldquo;{searchQuery}&rdquo;. Try typing another movie or series name.
                    </p>
                  )
                )}

                {/* Section: (?) How Content Contribution Works (Matches screenshot) */}
                <div className="pt-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 mb-3">
                    <HelpCircle size={16} className="text-purple-400" />
                    <span>How Content Contribution Works</span>
                  </h4>

                  {/* 3 Step Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Card 01 */}
                    <div className="p-4 rounded-2xl bg-[#121216] border border-white/5 space-y-2">
                      <span className="w-6 h-6 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[11px] font-bold flex items-center justify-center">
                        01
                      </span>
                      <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Search size={13} className="text-purple-400" />
                        <span>Verify Title</span>
                      </h5>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Search and select any movie or series to link the official high-resolution poster and backdrop.
                      </p>
                    </div>

                    {/* Card 02 */}
                    <div className="p-4 rounded-2xl bg-[#121216] border border-white/5 space-y-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-950/80 border border-blue-500/40 text-blue-300 text-[11px] font-bold flex items-center justify-center">
                        02
                      </span>
                      <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Layers size={13} className="text-blue-400" />
                        <span>Select Space Type</span>
                      </h5>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Choose whether your post is a Discussion, official Trailer, or Cinema News dispatch.
                      </p>
                    </div>

                    {/* Card 03 */}
                    <div className="p-4 rounded-2xl bg-[#121216] border border-white/5 space-y-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center justify-center">
                        03
                      </span>
                      <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Bookmark size={13} className="text-amber-400" />
                        <span>Publish to Feed</span>
                      </h5>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Your dispatch instantly appears on the community Space stream with full media previews.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Warning Banner (Matches screenshot) */}
                <div className="p-3.5 rounded-2xl bg-red-950/30 border border-red-900/40 flex items-start gap-2.5 text-xs text-red-300">
                  <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <p>
                    <span className="font-bold">WARNING:</span> Repeatedly submitting spam, fake titles, or false entries will result in a permanent ban from contributing content.
                  </p>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* STEP 1: SPACE TYPE SELECTION                                 */}
            {/* ------------------------------------------------------------ */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  CHOOSE SPACE DISPATCH TYPE
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: "discussion",
                      label: "Discussion",
                      desc: "Start a conversation, theories, questions, or deep critique",
                      icon: MessageSquare,
                      color: "from-purple-600 to-indigo-600",
                    },
                    {
                      id: "trailer",
                      label: "Trailer",
                      desc: "Official teaser, clip, or full cinematic trailer",
                      icon: Video,
                      color: "from-amber-500 to-rose-600",
                    },
                    {
                      id: "news",
                      label: "News",
                      desc: "Casting scoops, announcements, release dates, or updates",
                      icon: Newspaper,
                      color: "from-teal-500 to-emerald-600",
                    },
                  ].map((type) => {
                    const Icon = type.icon;
                    const isSelected = spaceType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSpaceType(type.id)}
                        className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between h-40 ${
                          isSelected
                            ? "bg-purple-950/50 border-purple-500 text-white shadow-xl shadow-purple-950/40 scale-[1.02]"
                            : "bg-[#121215] border-white/10 hover:border-white/20 text-zinc-400"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${type.color} text-white shadow`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{type.label}</h4>
                          <p className="text-xs text-zinc-400 mt-1 leading-snug">{type.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* STEP 2: MAIN CONTENT                                         */}
            {/* ------------------------------------------------------------ */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                    DISPATCH HEADLINE / TOPIC (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="e.g. Farzi Season 2 Announcement, Inception Ending Theory..."
                    className="w-full bg-[#121215] border border-white/15 focus:border-purple-500 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      DISPATCH TEXT / ARTICLE <span className="text-purple-400">*</span>
                    </label>
                    <span className="text-xs text-zinc-500">{content.length} chars</span>
                  </div>
                  <textarea
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={
                      spaceType === "news"
                        ? "Write the news update, source details, casting info..."
                        : spaceType === "trailer"
                        ? "Add trailer notes, impressions, or highlights..."
                        : "Share your thoughts, critique, or questions for fellow cinephiles..."
                    }
                    className="w-full bg-[#121215] border border-white/15 focus:border-purple-500 rounded-2xl p-4 text-sm text-white placeholder-zinc-500 outline-none transition resize-none"
                  />
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* STEP 3: TRAILERS & MEDIA                                     */}
            {/* ------------------------------------------------------------ */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                    YOUTUBE TRAILER LINK {spaceType === "trailer" && <span className="text-red-400">*</span>}
                  </label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or embed URL"
                    className="w-full bg-[#121215] border border-white/15 focus:border-purple-500 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition"
                  />
                  {autoLoadingTrailer && (
                    <p className="text-xs text-purple-400 mt-1.5 flex items-center gap-1">
                      <RefreshCw size={12} className="animate-spin" /> Querying official trailer...
                    </p>
                  )}
                </div>

                {videoUrl ? (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Live Video Preview
                    </label>
                    <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black max-h-60">
                      <iframe
                        src={getYouTubeEmbedUrl(videoUrl)}
                        title="Trailer Preview"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">
                    {spaceType === "trailer"
                      ? "Paste any YouTube trailer link above to generate a playable preview."
                      : "Optional: You can link a trailer for this movie or leave blank."}
                  </p>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* STEP 4: REVIEW & PUBLISH                                     */}
            {/* ------------------------------------------------------------ */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <h4 className="text-sm font-bold text-white mb-2">
                  Review Your Dispatch Summary
                </h4>

                <div className="p-4 rounded-2xl bg-[#121216] border border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    {selectedMovie?.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${selectedMovie.poster_path}`}
                        alt=""
                        className="w-12 h-16 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                        Category: {spaceType.toUpperCase()}
                      </span>
                      <h4 className="text-base font-bold text-white">
                        {postTitle || selectedMovie?.title || selectedMovie?.name}
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Linked Title: {selectedMovie?.title || selectedMovie?.name}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed pt-2 border-t border-white/5 whitespace-pre-line">
                    {content}
                  </p>

                  {videoUrl && (
                    <p className="text-xs text-amber-400 truncate">
                      Video: {videoUrl}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Global Form Error Notice */}
            {formError && (
              <div className="p-3 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
                {formError}
              </div>
            )}
          </div>

          {/* BOTTOM ACTIONS BAR (Matches screenshot Next button) */}
          <div className="h-16 px-6 border-t border-white/10 flex items-center justify-between shrink-0 bg-[#070709]">
            <div>
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-zinc-300 font-semibold transition cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
              )}
            </div>

            <div>
              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-900/40 transition cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-900/40 transition cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Publish Dispatch</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
