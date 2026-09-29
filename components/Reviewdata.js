"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  ArrowDownUp,
  BadgeCheck,
  Check,
  ChevronDown,
  Heart,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react"
import { ReviewListSkeleton } from "@/components/skeletons/HomeSectionSkeletons"
import { verdictOf } from "./Verdict.js"

/* ================= helpers ================= */
const SORTS = [
  { key: "liked", label: "Most Liked" },
  { key: "newest", label: "Newest" },
  { key: "highest", label: "Highest Rated" },
  { key: "lowest", label: "Lowest Rated" },
]

const compact = (n = 0) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}K` : `${n}`

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : ""

const likesOf = (rv) => rv.likesCount ?? rv.likes?.length ?? 0

const initialsOf = (name = "") => name.trim().slice(0, 2).toUpperCase() || "?"

const chipBase =
  "flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-white transition hover:bg-white/[0.07]"

/* ================= small pieces ================= */
function CheckChip({ checked, onChange, children }) {
  return (
    <label className={`${chipBase} cursor-pointer select-none`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-md border-2 border-violet-500 transition ${
          checked ? "bg-violet-500" : "bg-transparent"
        }`}
      >
        {checked && <Check size={12} strokeWidth={3} className="text-white" />}
      </span>
      {children}
    </label>
  )
}

function useClickOutside(ref, active, close) {
  useEffect(() => {
    if (!active) return
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) close()
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [active, ref, close])
}

function SortMenu({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, open, () => setOpen(false))
  const current = SORTS.find((s) => s.key === value)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={chipBase}
      >
        <ArrowDownUp size={16} />
        {current.label}
        <ChevronDown size={16} className="text-white/60" />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 z-30 mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#141416] py-1 shadow-2xl"
        >
          {SORTS.map((s) => (
            <li key={s.key}>
              <button
                type="button"
                role="option"
                aria-selected={s.key === value}
                onClick={() => {
                  onChange(s.key)
                  setOpen(false)
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-white/90 hover:bg-white/5"
              >
                {s.label}
                {s.key === value && <Check size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Avatar({ user }) {
  const src = user?.image || user?.avatar
  return src ? (
    <img src={src} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
  ) : (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-500/70 text-sm font-bold text-white">
      {initialsOf(user?.username)}
    </div>
  )
}

function ReviewItem({ rv, isOwner, showSpoilers, onOpenProfile, onAskDelete }) {
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [liked, setLiked] = useState(!!rv.likedByMe)
  const menuRef = useRef(null)
  useClickOutside(menuRef, menu, () => setMenu(false))

  const verdict = verdictOf(rv.rating || 0)
  const likes = likesOf(rv) + (liked ? 1 : 0) - (rv.likedByMe ? 1 : 0)
  const hidden = rv.isSpoiler && !showSpoilers && !revealed
  const text = rv.review || ""
  const isLong = text.length > 150 || text.split("\n").length > 3

  return (
    <article className="py-5 first:pt-0">
      {/* header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenProfile}
          aria-label={`Open ${rv.user?.username || "user"} profile`}
        >
          <Avatar user={rv.user} />
        </button>

        <div className="min-w-0">
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex max-w-full items-center gap-1.5 font-semibold text-white hover:underline"
          >
            <span className="truncate">{rv.user?.username || "User"}</span>
            {rv.user?.verified && (
              <BadgeCheck size={17} className="shrink-0 fill-sky-500 text-black" />
            )}
          </button>
          <p className="text-xs text-white/60">{fmtDate(rv.createdAt)}</p>
        </div>

        <span
          className={`ml-auto shrink-0 rounded-full px-3 py-1 text-xs font-bold ${verdict.badge}`}
        >
          {verdict.badgeLabel}
        </span>
      </div>

      {/* body */}
      <div className="mt-4">
        {hidden ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/60 hover:text-white"
          >
            This review contains spoilers. Tap to show.
          </button>
        ) : (
          <>
            <p
              className={`whitespace-pre-line break-words leading-relaxed text-white/85 ${
                open ? "" : "line-clamp-3"
              }`}
            >
              {text}
            </p>
            {isLong && (
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="mt-1 text-sm text-white/50 hover:text-white"
              >
                {open ? "less" : "more"}
              </button>
            )}
          </>
        )}
      </div>

      {/* footer */}
      <div className="mt-4 flex items-center gap-5 text-sm text-white/85">
        <button
          type="button"
          onClick={() => setLiked((l) => !l)} /* TODO: POST like to your API */
          aria-pressed={liked}
          className="flex items-center gap-2 transition hover:text-white"
        >
          <Heart
            size={22}
            className={liked ? "fill-rose-500 text-rose-500" : ""}
          />
          <span className="tabular-nums">{compact(likes)}</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 transition hover:text-white" /* TODO: open comments */
        >
          <MessageCircle size={22} />
          <span className="tabular-nums">
            {compact(rv.commentsCount ?? rv.comments?.length ?? 0)}
          </span>
        </button>

        <div ref={menuRef} className="relative ml-auto">
          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            aria-label="More options"
            className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <MoreHorizontal size={20} />
          </button>
          {menu && (
            <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-xl border border-white/10 bg-[#141416] py-1 shadow-2xl">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(text)
                  setMenu(false)
                }}
                className="block w-full px-3 py-2 text-left text-sm text-white/90 hover:bg-white/5"
              >
                Copy text
              </button>
              {isOwner && (
                <button
                  type="button"
                  onClick={() => {
                    setMenu(false)
                    onAskDelete()
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-rose-400 hover:bg-rose-500/10"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

/* ================= main ================= */
export default function Reviewdata({ movieId, refreshKey }) {
  const router = useRouter()
  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  const [sort, setSort] = useState("liked")
  const [showSpoilers, setShowSpoilers] = useState(false)
  const [followingOnly, setFollowingOnly] = useState(false)

  useEffect(() => {
    if (!movieId) return
    let mounted = true

    fetch(`/api/review?movieId=${movieId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load reviews")
        return res.json()
      })
      .then((data) => {
        if (!mounted) return
        setError(null)
        setReviews(data.reviews || [])
      })
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [movieId, refreshKey])

  // filter + sort (hook stays above the early returns)
  const visible = useMemo(() => {
    const list = followingOnly
      ? reviews.filter((r) => r.user?.isFollowing)
      : [...reviews]
    const byDate = (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    list.sort((a, b) => {
      if (sort === "highest") return (b.rating || 0) - (a.rating || 0) || byDate(a, b)
      if (sort === "lowest") return (a.rating || 0) - (b.rating || 0) || byDate(a, b)
      if (sort === "newest") return byDate(a, b)
      return likesOf(b) - likesOf(a) || byDate(a, b)
    })
    return list
  }, [reviews, sort, followingOnly])

  const handleDelete = async () => {
    const reviewId = pendingDelete
    setPendingDelete(null)
    try {
      const res = await fetch("/api/review", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, reviewId }),
      })
      if (res.ok) setReviews((prev) => prev.filter((r) => r._id !== reviewId))
    } catch (err) {
      console.error("Error deleting review:", err)
    }
  }

  if (!movieId) return null

  return (
    <section className="mt-8 w-full text-white">
      {/* title + controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-white/90">User Reviews</h2>
        <div className="flex flex-wrap items-center gap-2">
          <SortMenu value={sort} onChange={setSort} />
          <CheckChip checked={showSpoilers} onChange={setShowSpoilers}>
            Show Spoilers
          </CheckChip>
          <CheckChip checked={followingOnly} onChange={setFollowingOnly}>
            Following Only
          </CheckChip>
        </div>
      </div>

      {/* list */}
      <div className="mt-6">
        {loading ? (
          <ReviewListSkeleton />
        ) : error ? (
          <p className="text-rose-400">{error}</p>
        ) : visible.length === 0 ? (
          <p className="text-white/50">
            {followingOnly
              ? "No reviews from people you follow yet."
              : "No reviews yet. Be the first to post."}
          </p>
        ) : (
          <div className="divide-y divide-white/10">
            {visible.map((rv) => (
              <ReviewItem
                key={rv._id}
                rv={rv}
                isOwner={!!currentUserId && rv.user?._id === currentUserId}
                showSpoilers={showSpoilers}
                onOpenProfile={() => router.push(`/user/${rv.user?.username}`)}
                onAskDelete={() => setPendingDelete(rv._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* delete confirmation (single modal) */}
      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setPendingDelete(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[320px] rounded-2xl border border-white/10 bg-[#0f0f11] p-6 shadow-2xl"
          >
            <h3 className="mb-2 text-lg font-semibold">Delete review?</h3>
            <p className="mb-6 text-sm text-white/50">
              This can't be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPendingDelete(null)}
                className="rounded-lg bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}