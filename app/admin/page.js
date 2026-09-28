"use client"
import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  Shield,
  Film,
  Tv,
  Search,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Check,
  ExternalLink,
  Star,
  Layers,
  RefreshCw,
  AlertCircle,
  Tag,
  Eye,
} from "lucide-react"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { AdminRowsSkeleton, SkeletonBlock } from "@/components/skeletons/HomeSectionSkeletons"

const CURATOR_TAGS = [
  "NAC Vault",
  "Masterpiece",
  "Cult Classic",
  "Essential Cinema",
  "Director's Cut",
  "Mind Bending",
  "Staff Favorite",
  "Hidden Gem",
]

export default function AdminPage() {
  const { data: session, status } = useSession()

  // Admin verification state
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Active section tab: "editors-pick" | "nac-collection"
  const [activeTab, setActiveTab] = useState("editors-pick")

  // Data states
  const [editorsPicks, setEditorsPicks] = useState([])
  const [nacCollection, setNacCollection] = useState([])
  const [loadingData, setLoadingData] = useState(false)

  // Search TMDB state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("multi") // multi, movie, tv
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)

  // Modals / forms
  const [collectionTagModal, setCollectionTagModal] = useState(null)
  const [selectedTag, setSelectedTag] = useState("NAC Vault")
  const [customCuratorNote, setCustomCuratorNote] = useState("")

  // Toast / alerts
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3500)
  }

  // 1. Verify Admin Status
  useEffect(() => {
    async function verify() {
      if (status === "loading") return
      if (!session) {
        setCheckingAuth(false)
        return
      }

      try {
        const res = await fetch("/api/admin/check")
        const data = await res.json()
        setIsAdmin(Boolean(data.isAdmin))
      } catch (err) {
        console.error("Admin check failed", err)
      } finally {
        setCheckingAuth(false)
      }
    }

    verify()
  }, [session, status])

  // 2. Fetch Data if Admin
  const loadAdminData = async () => {
    setLoadingData(true)
    try {
      const [resPicks, resCol] = await Promise.all([
        fetch("/api/admin/editors-pick"),
        fetch("/api/admin/nac-collection"),
      ])
      const dataPicks = await resPicks.json()
      const dataCol = await resCol.json()

      if (dataPicks.picks) setEditorsPicks(dataPicks.picks)
      if (dataCol.items) setNacCollection(dataCol.items)
    } catch (err) {
      console.error("Error loading admin data:", err)
      showNotification("Failed to load curated lists", "error")
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      loadAdminData()
    }
  }, [isAdmin])

  // 3. TMDB Live Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setSearching(false)
      return
    }

    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const endpoint =
          searchType === "movie"
            ? `/api/tmdb/search/movie?query=${encodeURIComponent(searchQuery)}`
            : searchType === "tv"
            ? `/api/tmdb/search/tv?query=${encodeURIComponent(searchQuery)}`
            : `/api/tmdb/search/multi?query=${encodeURIComponent(searchQuery)}`

        const res = await fetch(endpoint)
        const data = await res.json()

        // Filter only movies and tv shows
        const filtered = (data?.results || []).filter(
          (item) => item.media_type === "movie" || item.media_type === "tv" || (!item.media_type && (item.title || item.name))
        )
        setSearchResults(filtered)
      } catch (err) {
        console.error("TMDB search error:", err)
      } finally {
        setSearching(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery, searchType])

  // Add item to Editor's Pick
  const handleAddToEditorsPick = async (item) => {
    const isTv = item.media_type === "tv" || (!item.title && Boolean(item.name))
    const payload = {
      movieId: item.id,
      mediaType: isTv ? "tv" : "movie",
      title: item.title || item.name,
      poster_path: item.poster_path || "",
      backdrop_path: item.backdrop_path || "",
      vote_average: item.vote_average || 0,
      release_date: item.release_date || item.first_air_date || "",
      overview: item.overview || "",
      curatorNote: "",
    }

    try {
      const res = await fetch("/api/admin/editors-pick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (res.ok) {
        setEditorsPicks((prev) => [...prev, data.pick])
        showNotification(`Added "${payload.title}" to Editor's Pick!`)
      } else {
        showNotification(data.error || "Failed to add pick", "error")
      }
    } catch (err) {
      showNotification("Network error adding to Editor's Pick", "error")
    }
  }

  // Delete pick
  const handleDeletePick = async (id, title) => {
    try {
      const res = await fetch(`/api/admin/editors-pick?id=${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setEditorsPicks((prev) => prev.filter((p) => p._id !== id))
        showNotification(`Removed "${title}" from Editor's Pick`)
      } else {
        showNotification("Failed to delete pick", "error")
      }
    } catch (err) {
      showNotification("Network error deleting pick", "error")
    }
  }

  // Reorder picks
  const handleMovePick = async (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= editorsPicks.length) return

    const newPicks = [...editorsPicks]
    const temp = newPicks[index]
    newPicks[index] = newPicks[targetIndex]
    newPicks[targetIndex] = temp

    setEditorsPicks(newPicks)

    try {
      const orderedIds = newPicks.map((p) => p._id)
      await fetch("/api/admin/editors-pick", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      })
    } catch (err) {
      showNotification("Failed to save new order", "error")
    }
  }

  // Edit curator note for Editor's Pick
  const handleEditPickNote = async (pick) => {
    const current = pick.curatorNote || ""
    const newNote = window.prompt(`Curator note for "${pick.title}":`, current)
    if (newNote === null) return
    try {
      const res = await fetch("/api/admin/editors-pick", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pick._id, curatorNote: newNote }),
      })
      if (res.ok) {
        setEditorsPicks((prev) =>
          prev.map((p) => (p._id === pick._id ? { ...p, curatorNote: newNote } : p))
        )
        showNotification("Curator note updated")
      }
    } catch (err) {
      showNotification("Failed to update note", "error")
    }
  }

  // Edit tag for NAC Collection item
  const handleEditCollectionItem = async (item) => {
    const currentTag = item.tag || "NAC Vault"
    const newTag = window.prompt(
      `Update tag for "${item.title}" (e.g. Masterpiece, Cult Classic, Essential Cinema):`,
      currentTag
    )
    if (newTag === null) return
    try {
      const res = await fetch("/api/admin/nac-collection", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item._id, tag: newTag }),
      })
      if (res.ok) {
        setNacCollection((prev) =>
          prev.map((i) => (i._id === item._id ? { ...i, tag: newTag } : i))
        )
        showNotification("Collection tag updated")
      }
    } catch (err) {
      showNotification("Failed to update tag", "error")
    }
  }

  // Open NAC Collection tag dialog
  const handleOpenCollectionModal = (item) => {
    setCollectionTagModal(item)
    setSelectedTag("NAC Vault")
    setCustomCuratorNote("")
  }

  // Add to NAC Collection
  const handleSaveToCollection = async () => {
    if (!collectionTagModal) return
    const item = collectionTagModal
    const isTv = item.media_type === "tv" || (!item.title && Boolean(item.name))

    const payload = {
      movieId: item.id,
      mediaType: isTv ? "tv" : "movie",
      title: item.title || item.name,
      poster_path: item.poster_path || "",
      backdrop_path: item.backdrop_path || "",
      vote_average: item.vote_average || 0,
      release_date: item.release_date || item.first_air_date || "",
      overview: item.overview || "",
      tag: selectedTag,
      curatorNote: customCuratorNote,
    }

    try {
      const res = await fetch("/api/admin/nac-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (res.ok) {
        setNacCollection((prev) => [...prev, data.item])
        setCollectionTagModal(null)
        showNotification(`Added "${payload.title}" to NAC Collection!`)
      } else {
        showNotification(data.error || "Failed to add to collection", "error")
      }
    } catch (err) {
      showNotification("Network error saving to collection", "error")
    }
  }

  // Delete from NAC Collection
  const handleDeleteCollectionItem = async (id, title) => {
    try {
      const res = await fetch(`/api/admin/nac-collection?id=${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setNacCollection((prev) => prev.filter((item) => item._id !== id))
        showNotification(`Removed "${title}" from NAC Collection`)
      } else {
        showNotification("Failed to remove item", "error")
      }
    } catch (err) {
      showNotification("Network error deleting item", "error")
    }
  }

  // LOADING STATE
  if (status === "loading" || checkingAuth) {
    return (
      <div className="blackgreengrad min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-slate-400">Verifying Admin Clearance...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="blackgreengrad min-h-screen flex items-center justify-center p-6 text-center text-white">
        <div>
          <p className="text-sm font-semibold tracking-widest text-white/50">404</p>
          <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
          <p className="mt-2 text-sm text-white/50">The page you are looking for does not exist.</p>
          <Link href="/" className="mt-6 inline-block text-sm text-white/70 hover:text-white transition-colors">
            Return home
          </Link>
        </div>
      </div>
    )
  }

  // ADMIN IS AUTHENTICATED: RENDER ADMIN DASHBOARD
  return (
    <div className="blackgreengrad min-h-screen text-white pt-20 pb-16 px-4 sm:px-8 lg:px-12">
      {/* TOAST NOTIFICATION */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-medium border backdrop-blur-xl animate-scaleIn ${
            notification.type === "error"
              ? "bg-red-950/90 border-red-500/50 text-red-200"
              : "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
          }`}
        >
          {notification.type === "error" ? <AlertCircle size={16} /> : <Check size={16} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* MODAL: ADD TO NAC COLLECTION TAG SELECTOR */}
      {collectionTagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-gray-950 border border-white/20 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Sparkles className="text-amber-400" size={18} />
              <span>Add to NAC Collection</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Adding &ldquo;{collectionTagModal.title || collectionTagModal.name}&rdquo;
            </p>

            {/* TAG SELECTOR */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Curator Vault Tag
              </label>
              <div className="flex flex-wrap gap-2">
                {CURATOR_TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTag(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedTag === t
                        ? "bg-amber-500 text-black font-semibold shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                        : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* CURATOR NOTE */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Curator Note / Reason for Inclusion (Optional)
              </label>
              <input
                type="text"
                value={customCuratorNote}
                onChange={(e) => setCustomCuratorNote(e.target.value)}
                placeholder="e.g. Masterclass in suspense, Nolan's definitive sci-fi"
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setCollectionTagModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveToCollection}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg transition"
              >
                Save to NAC Collection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Shield size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
                  NAC Admin Console
                </h1>
                <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Curator mode active for <span className="text-purple-300 font-medium">{session.user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition"
            >
              <Eye size={14} />
              <span>Preview Home</span>
              <ExternalLink size={12} className="opacity-60" />
            </Link>
            <Link
              href="/collection"
              target="_blank"
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 flex items-center gap-1.5 transition"
            >
              <Sparkles size={14} />
              <span>View Collection</span>
              <ExternalLink size={12} className="opacity-60" />
            </Link>
            <button
              onClick={loadAdminData}
              disabled={loadingData}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition disabled:opacity-50"
              title="Refresh curated lists"
            >
              <RefreshCw size={14} className={loadingData ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div className="p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/5">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Editor&apos;s Picks</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">
              {loadingData ? <SkeletonBlock className="inline-block h-7 w-8 align-middle" /> : editorsPicks.length} <span className="text-xs text-slate-500 font-normal">/ 5 featured</span>
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/5">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">NAC Collection</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {loadingData ? <SkeletonBlock className="inline-block h-7 w-8 align-middle" /> : nacCollection.length} <span className="text-xs text-slate-500 font-normal">titles vaulted</span>
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/5">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Editor Fallback</p>
            <p className="text-xs font-medium text-slate-300 mt-2">
              {editorsPicks.length === 0 ? "⚠️ TMDB Top Rated" : "✅ Custom Picks Live"}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/5">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Curator Level</p>
            <p className="text-xs font-semibold text-emerald-400 mt-2 flex items-center gap-1">
              <Shield size={13} /> Full Administrator
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: MANAGEMENT TABS (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* TAB BUTTONS */}
          <div className="flex p-1.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl">
            <button
              onClick={() => setActiveTab("editors-pick")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 ${
                activeTab === "editors-pick"
                  ? "bg-gradient-to-r from-purple-800 to-indigo-700 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Film size={16} />
              <span>Editor&apos;s Pick</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40">
                {loadingData ? <SkeletonBlock className="inline-block h-3 w-4 align-middle" /> : editorsPicks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("nac-collection")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 ${
                activeTab === "nac-collection"
                  ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles size={16} />
              <span>NAC Collection</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40">
                {loadingData ? <SkeletonBlock className="inline-block h-3 w-4 align-middle" /> : nacCollection.length}
              </span>
            </button>
          </div>

          {/* TAB 1: EDITOR'S PICK MANAGER */}
          {activeTab === "editors-pick" && (
            <div className="p-5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Manage Homepage Editor&apos;s Pick</span>
                    <span className="text-[11px] text-purple-400 font-mono">({editorsPicks.length} of 5)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Drag or use the arrows to reorder. The top 5 appear on the homepage.
                  </p>
                </div>
              </div>

              {/* LIVE HOMEPAGE PREVIEW STRIP */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-purple-300 mb-3 flex items-center gap-1.5">
                  <Eye size={13} />
                  <span>Homepage Live Preview</span>
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {[0, 1, 2, 3, 4].map((idx) => {
                    const pick = editorsPicks[idx]
                    return (
                      <div
                        key={idx}
                        className="aspect-[2/3] rounded-lg border border-dashed border-white/20 bg-black/40 relative overflow-hidden flex flex-col items-center justify-center text-center p-1"
                      >
                        {pick ? (
                          <>
                            <img
                              src={
                                pick.poster_path
                                  ? `https://image.tmdb.org/t/p/w185${pick.poster_path}`
                                  : "/placeholder.png"
                              }
                              alt={pick.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <span className="absolute bottom-1 px-1 text-[10px] font-semibold text-white truncate w-full">
                              {pick.title}
                            </span>
                            <span className="absolute top-1 left-1 bg-black/80 px-1 rounded text-[9px] font-bold text-purple-300">
                              #{idx + 1}
                            </span>
                          </>
                        ) : (
                          <div className="text-slate-600 flex flex-col items-center">
                            <Plus size={16} />
                            <span className="text-[10px] mt-1">Slot {idx + 1}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* LIST OF CURRENT PICKS */}
              <div className="flex flex-col gap-3">
                {loadingData ? <AdminRowsSkeleton count={3} /> : editorsPicks.length === 0 ? (
                  <div className="text-center py-10 rounded-xl bg-white/[0.02] border border-white/5">
                    <Film className="mx-auto text-slate-600 mb-2" size={28} />
                    <p className="text-sm text-slate-400 font-medium">No custom Editor&apos;s Picks added yet</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Search TMDB in the right panel and click &ldquo;+ Add to Editor&apos;s Pick&rdquo; to curate your top 5 films.
                    </p>
                  </div>
                ) : (
                  editorsPicks.map((pick, idx) => (
                    <div
                      key={pick._id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition group"
                    >
                      {/* ORDER NUMBER */}
                      <span className="w-6 text-center text-xs font-bold text-purple-400">
                        #{idx + 1}
                      </span>

                      {/* POSTER */}
                      <img
                        src={
                          pick.poster_path
                            ? `https://image.tmdb.org/t/p/w92${pick.poster_path}`
                            : "/placeholder.png"
                        }
                        alt={pick.title}
                        className="w-12 h-16 rounded-lg object-cover shrink-0"
                      />

                      {/* INFO */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">
                          {pick.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span className="capitalize">{pick.mediaType === "tv" ? "TV Series" : "Movie"}</span>
                          {pick.release_date && <span>• {pick.release_date.slice(0, 4)}</span>}
                          {pick.vote_average ? (
                            <span className="text-green-400 font-medium flex items-center gap-0.5">
                              ★ {Number(pick.vote_average).toFixed(1)}
                            </span>
                          ) : null}
                        </div>
                        {pick.curatorNote && (
                          <p className="text-[11px] text-purple-300 italic truncate mt-1">
                            &ldquo;{pick.curatorNote}&rdquo;
                          </p>
                        )}
                      </div>

                      {/* REORDER BUTTONS */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditPickNote(pick)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 transition"
                          title="Edit Curator Note"
                        >
                          <Tag size={14} />
                        </button>
                        <button
                          onClick={() => handleMovePick(idx, "up")}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition"
                          title="Move Up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => handleMovePick(idx, "down")}
                          disabled={idx === editorsPicks.length - 1}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition"
                          title="Move Down"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          onClick={() => handleDeletePick(pick._id, pick.title)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition ml-1"
                          title="Remove from picks"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: NAC COLLECTION MANAGER */}
          {activeTab === "nac-collection" && (
            <div className="p-5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-amber-400" size={18} />
                    <span>Manage NAC Collection</span>
                    <span className="text-[11px] text-amber-400 font-mono">({nacCollection.length} items)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Selected particular movies & series featured in the public NAC Collection vault.
                  </p>
                </div>
              </div>

              {/* LIST OF NAC COLLECTION ITEMS */}
              <div className="flex flex-col gap-3">
                {loadingData ? <AdminRowsSkeleton count={3} /> : nacCollection.length === 0 ? (
                  <div className="text-center py-10 rounded-xl bg-white/[0.02] border border-white/5">
                    <Sparkles className="mx-auto text-slate-600 mb-2" size={28} />
                    <p className="text-sm text-slate-400 font-medium">No movies in NAC Collection yet</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Search TMDB in the right panel and click &ldquo;+ Add to NAC Collection&rdquo; to add handpicked gems to the archive.
                    </p>
                  </div>
                ) : (
                  nacCollection.map((item, idx) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition group"
                    >
                      <img
                        src={
                          item.poster_path
                            ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                            : "/placeholder.png"
                        }
                        alt={item.title}
                        className="w-12 h-16 rounded-lg object-cover shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white truncate">
                            {item.title}
                          </h4>
                          {item.tag && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 shrink-0">
                              {item.tag}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span className="capitalize">{item.mediaType === "tv" ? "TV Series" : "Movie"}</span>
                          {item.release_date && <span>• {item.release_date.slice(0, 4)}</span>}
                          {item.vote_average ? (
                            <span className="text-green-400 font-medium">
                              ★ {Number(item.vote_average).toFixed(1)}
                            </span>
                          ) : null}
                        </div>

                        {item.curatorNote && (
                          <p className="text-[11px] text-slate-400/90 italic truncate mt-1">
                            &ldquo;{item.curatorNote}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditCollectionItem(item)}
                          className="p-2 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 transition"
                          title="Edit Tag"
                        >
                          <Tag size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteCollectionItem(item._id, item.title)}
                          className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                          title="Remove from collection"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: TMDB SEARCH & ADD PANEL (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 sticky top-24">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Search className="text-purple-400" size={18} />
              <span>Search TMDB Library</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Find any movie or TV series on TMDB to add to Editor&apos;s Pick or NAC Collection.
            </p>

            {/* SEARCH INPUT */}
            <div className="flex items-center gap-2 bg-black/80 rounded-xl border border-white/10 p-2 mb-3 focus-within:border-purple-500 transition">
              <Search size={16} className="text-slate-400 shrink-0 ml-1" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, TV shows, anime..."
                className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>

            {/* TYPE FILTER PILLS */}
            <div className="flex gap-2 mb-4">
              {[
                { label: "All Media", val: "multi" },
                { label: "Movies Only", val: "movie" },
                { label: "Series Only", val: "tv" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setSearchType(opt.val)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                    searchType === opt.val
                      ? "bg-purple-600 text-white font-semibold"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* SEARCH RESULTS LIST */}
            <div className="max-h-[500px] overflow-y-auto space-y-3 pr-1 scrollbar-hidden">
              {searching ? (
                <AdminRowsSkeleton count={3} label="TMDB search results" />
              ) : searchQuery && searchResults.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500">
                  No movies or series found for &ldquo;{searchQuery}&rdquo;
                </div>
              ) : !searchQuery ? (
                <div className="text-center py-12 text-slate-600 text-xs flex flex-col items-center">
                  <Search size={28} className="mb-2 opacity-40" />
                  <span>Type a title above to search TMDB</span>
                </div>
              ) : (
                searchResults.map((m) => {
                  const title = m.title || m.name
                  const isTv = m.media_type === "tv" || (!m.title && Boolean(m.name))
                  const year = (m.release_date || m.first_air_date || "").slice(0, 4)
                  const isAlreadyInPicks = editorsPicks.some(
                    (p) => p.movieId === m.id
                  )
                  const isAlreadyInCollection = nacCollection.some(
                    (c) => c.movieId === m.id
                  )

                  return (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition flex gap-3"
                    >
                      <img
                        src={
                          m.poster_path
                            ? `https://image.tmdb.org/t/p/w92${m.poster_path}`
                            : "/placeholder.png"
                        }
                        alt={title}
                        className="w-14 h-20 rounded-lg object-cover shrink-0"
                      />

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-semibold text-white truncate">
                            {title}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            <span>{isTv ? "TV Series" : "Movie"}</span>
                            {year && <span>• {year}</span>}
                            {m.vote_average ? (
                              <span className="text-green-400 font-medium">
                                ★ {Number(m.vote_average).toFixed(1)}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <button
                            onClick={() => handleAddToEditorsPick(m)}
                            disabled={isAlreadyInPicks}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition flex items-center gap-1 ${
                              isAlreadyInPicks
                                ? "bg-purple-900/30 text-purple-400/60 cursor-not-allowed border border-purple-500/20"
                                : "bg-purple-600 hover:bg-purple-500 text-white shadow-sm"
                            }`}
                          >
                            {isAlreadyInPicks ? (
                              <>
                                <Check size={10} />
                                <span>In Picks</span>
                              </>
                            ) : (
                              <>
                                <Plus size={10} />
                                <span>+ Editor&apos;s Pick</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleOpenCollectionModal(m)}
                            disabled={isAlreadyInCollection}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition flex items-center gap-1 ${
                              isAlreadyInCollection
                                ? "bg-amber-900/30 text-amber-400/60 cursor-not-allowed border border-amber-500/20"
                                : "bg-amber-600 hover:bg-amber-500 text-white shadow-sm"
                            }`}
                          >
                            {isAlreadyInCollection ? (
                              <>
                                <Check size={10} />
                                <span>In Vault</span>
                              </>
                            ) : (
                              <>
                                <Sparkles size={10} />
                                <span>+ NAC Collection</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
