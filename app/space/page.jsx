"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Home,
  Newspaper,
  MessageSquare,
  PlaySquare,
  Edit3,
  Bookmark,
  SlidersHorizontal,
  Search,
  Plus,
  X,
  Sparkles,
  RefreshCw,
  Film,
} from "lucide-react";
import SpaceFeedItem from "@/components/space/SpaceFeedItem";
import RightSidebarMerch from "@/components/space/RightSidebarMerch";
import CreateSpaceModal from "@/components/space/CreateSpaceModal";
import { SpaceSkeletonCard } from "@/components/space/SpaceSkeleton";

const TOPICS = [
  "All Topics",
  "Farzi / OTT",
  "Hollywood",
  "Marvel / DC",
  "Sci-Fi",
  "Crime Thriller",
  "Bollywood",
  "Anime",
];

export default function SpacePage() {
  const { data: session } = useSession();

  // Navigation & Filter state
  const [activeNav, setActiveNav] = useState("feed"); // 'feed' | 'news' | 'discussions' | 'trailers'
  const [activeTopic, setActiveTopic] = useState("All Topics");
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  // Data state
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Modal & Toast
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch spaces based on active category
  const loadSpaces = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      let typeParam = "";
      if (activeNav === "news") typeParam = "?type=news";
      else if (activeNav === "discussions") typeParam = "?type=discussion";
      else if (activeNav === "trailers") typeParam = "?type=trailer";

      const res = await fetch(`/api/space${typeParam}`, { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load spaces");
      }

      setSpaces(data.spaces || []);
    } catch (err) {
      console.error("Error loading spaces:", err);
      setError("Unable to load dispatches right now.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSpaces();
  }, [activeNav]);

  const handleCreated = (newSpace) => {
    setSpaces((prev) => [newSpace, ...prev]);
    setToastMessage("Published to Space!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleSearch = () => {
    setSearchOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      } else {
        setSearchQuery("");
      }
      return next;
    });
  };

  // Filter items by search query & topic
  const filteredSpaces = useMemo(() => {
    return spaces.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.content?.toLowerCase().includes(q) ||
        item.movieId?.movieTitle?.toLowerCase().includes(q) ||
        item.postedBy?.username?.toLowerCase().includes(q);

      const matchesTopic =
        activeTopic === "All Topics" ||
        item.content?.toLowerCase().includes(activeTopic.toLowerCase()) ||
        item.title?.toLowerCase().includes(activeTopic.toLowerCase()) ||
        item.movieId?.movieTitle?.toLowerCase().includes(activeTopic.toLowerCase());

      return matchesSearch && matchesTopic;
    });
  }, [spaces, searchQuery, activeTopic]);

  // Navigation Items
  const navItems = [
    { id: "feed", label: "Feed", icon: Home },
    { id: "news", label: "News", icon: Newspaper },
    { id: "discussions", label: "Discussions", icon: MessageSquare },
    { id: "trailers", label: "Trailers", icon: PlaySquare },
    { id: "reviews", label: "Reviews", icon: Edit3, href: "/movie" },
    { id: "collections", label: "Collections", icon: Bookmark, href: "/collection" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-20 sm:pt-24 pb-20 selection:bg-purple-600 selection:text-white">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-2xl backdrop-blur-xl animate-scaleIn">
          <Sparkles size={15} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid items-start justify-center gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,4fr)]">
          
          {/* ============================================================== */}
          {/* LEFT SIDEBAR (STICKY NAVIGATION - Matches screenshot)           */}
          {/* ============================================================== */}
          <div>    <aside className="w-48 xl:w-56 fixed shrink-0 hidden md:block  top-24 self-start p-4 ">
            <nav className="space-y-1.5" aria-label="Space Sidebar Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;

                if (item.href) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Icon size={19} className="shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveNav(item.id);
                    }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? "bg-[#222225] text-white shadow-sm font-semibold"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={19} className="shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* CREATE POST ACTION BUTTON */}
            <div className="mt-8 px-1">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 hover:scale-[1.02] active:scale-98 transition cursor-pointer"
              >
                <Plus size={16} />
                <span>Create Dispatch</span>
              </button>
            </div>
          </aside></div>
      

          {/* ============================================================== */}
          {/* CENTER COLUMN (MAIN STREAM FEED - Matches screenshot)          */}
          {/* ============================================================== */}
          <main className="flex-1 max-w-2xl mx-auto w-full">
            
            {/* MOBILE NAVIGATION TABS (Visible only on small screens) */}
            <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 no-scrollbar">
              {navItems.slice(0, 4).map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      isActive ? "bg-[#222225] text-white" : "text-zinc-400 hover:text-white bg-zinc-900/60"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white whitespace-nowrap ml-auto"
              >
                <Plus size={14} />
                <span>Post</span>
              </button>
            </div>

            {/* TOP BAR: Topics (5) & Search Button (Matches screenshot) */}
            <div className="flex items-center justify-between gap-3 mb-6 relative">
              {/* TOPICS BUTTON */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setTopicsOpen((prev) => !prev)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium transition cursor-pointer ${
                    topicsOpen || activeTopic !== "All Topics"
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-[#121215] border-white/10 text-zinc-300 hover:text-white hover:border-white/20"
                  }`}
                >
                  <SlidersHorizontal size={14} className="text-zinc-400" />
                  <span>Topics</span>
                  <span className="w-4 h-4 rounded-full bg-white/10 text-[10px] flex items-center justify-center font-bold text-zinc-300">
                    5
                  </span>
                </button>

                {/* Topics Dropdown Pill Menu */}
                {topicsOpen && (
                  <div className="absolute left-0 top-full mt-2 w-64 p-2 rounded-2xl bg-[#141418] border border-white/10 shadow-2xl z-30 flex flex-wrap gap-1.5 backdrop-blur-xl animate-scaleIn">
                    {TOPICS.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => {
                          setActiveTopic(topic);
                          setTopicsOpen(false);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                          activeTopic === topic
                            ? "bg-purple-600 text-white"
                            : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* SEARCH ICON BUTTON & EXPANDABLE INPUT (Matches screenshot) */}
              <div className="flex items-center gap-2">
                {searchOpen ? (
                  <div className="relative flex items-center animate-scaleIn">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search dispatches..."
                      className="bg-[#141418] border border-white/15 focus:border-zinc-400 rounded-full pl-3.5 pr-8 py-1.5 text-xs text-white placeholder-zinc-500 outline-none w-48 sm:w-60 transition"
                    />
                    <button
                      type="button"
                      onClick={handleToggleSearch}
                      className="absolute right-2 text-zinc-400 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleToggleSearch}
                    className="w-8 h-8 rounded-full bg-[#121215] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition cursor-pointer"
                    aria-label="Search"
                  >
                    <Search size={14} />
                  </button>
                )}

                {/* Refresh Feed */}
                <button
                  type="button"
                  onClick={() => loadSpaces(true)}
                  disabled={refreshing}
                  className="w-8 h-8 rounded-full bg-[#121215] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition cursor-pointer"
                  title="Refresh feed"
                >
                  <RefreshCw
                    size={13}
                    className={refreshing ? "animate-spin text-purple-400" : ""}
                  />
                </button>
              </div>
            </div>

            {/* FEED LIST */}
            {loading ? (
              <div className="space-y-10">
                <SpaceSkeletonCard />
                <SpaceSkeletonCard />
              </div>
            ) : filteredSpaces.length === 0 ? (
              <div className="text-center py-20 px-4 rounded-3xl bg-[#0e0e12] border border-white/5 my-4">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 text-zinc-400 flex items-center justify-center mx-auto mb-3">
                  <Film size={24} />
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  {searchQuery ? "No matching dispatches" : "No Space dispatches yet"}
                </h3>
                <p className="text-zinc-400 text-xs max-w-sm mx-auto mb-5">
                  {searchQuery
                    ? `No items found for "${searchQuery}".`
                    : "Be the first to search for a movie, link the poster/backdrop, and share a trailer, discussion or news!"}
                </p>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-black hover:bg-zinc-200 transition"
                >
                  <Plus size={14} />
                  <span>Create First Post</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredSpaces.map((space) => (
                  <SpaceFeedItem
                    key={space._id}
                    space={space}
                    onCommentClick={() => {
                      // Open quick comment / discuss
                      setIsModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </main>

          {/* ============================================================== */}
          {/* RIGHT SIDEBAR (MERCH & CURATED SPOTLIGHT - Matches screenshot) */}
          {/* ============================================================== */}
          {/* <RightSidebarMerch/> */}
        </div>
      </div>

      {/* CREATE SPACE MODAL */}
      <CreateSpaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreated}
      />
    </div>
  );
}
