"use client"
import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { VERDICTS } from "./Verdict"

const MAX_LEN = 1000

const initialsOf = (name = "") =>
  name.replace(/^@/, "").trim().slice(0, 2).toUpperCase() || "?"

/**
 * user (optional override): { username, image }
 * Falls back to the next-auth session.
 */
export default function ReviewForm({ movieId, onSuccess, user }) {
  const { data: session } = useSession()
  const username =
    user?.username ||
    session?.user?.username ||
    session?.user?.name ||
    "guest"
  const image = user?.image || session?.user?.image

  const [reviewText, setReviewText] = useState("")
  const [verdict, setVerdict] = useState("timepass")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const textareaRef = useRef(null)

  // auto-grow textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = Math.min(400, ta.scrollHeight) + "px"
  }, [reviewText])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!movieId) return setError("Missing movie id")
    const rating = VERDICTS.find((v) => v.key === verdict).rating

    setLoading(true)
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, reviewText, rating }),
      })
      const data = await res.json()
      if (!res.ok) setError(data?.error || "Failed")
      else {
        setSuccess("Review saved!")
        setReviewText("")
        setVerdict("timepass")
        onSuccess?.(data)
      }
    } catch {
      setError("Network error")
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-white/10 bg-[#0f0f11] p-4 sm:p-5"
    >
      {/* header: user + verdict */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          {image ? (
            <img
              src={image}
              alt=""
              className="h-12 w-12 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-500/70 text-sm font-bold text-white">
              {initialsOf(username)}
            </div>
          )}
          <span className="truncate font-semibold text-white">
            @{username.replace(/^@/, "")}
          </span>
        </div>

        <div
          role="radiogroup"
          aria-label="Your verdict"
          className="grid w-full grid-cols-4 gap-1 rounded-full border border-white/10 bg-[#1c1c1e] p-1 sm:w-[400px]"
        >
          {VERDICTS.map((v) => {
            const selected = verdict === v.key
            return (
              <button
                key={v.key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setVerdict(v.key)}
                className={`rounded-full px-1 py-2 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60 sm:px-3 sm:text-sm ${
                  selected ? v.active : "text-white/90 hover:bg-white/5"
                }`}
              >
                {v.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* text */}
      <textarea
        ref={textareaRef}
        rows={2}
        value={reviewText}
        maxLength={MAX_LEN}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Write your review here..."
        className="mt-4 w-full resize-none border-0 border-b border-white/15 bg-transparent py-2 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-0"
      />
      <div className="mt-1 text-right text-xs tabular-nums text-white/40">
        {reviewText.length}/{MAX_LEN}
      </div>

      {/* footer */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="min-w-0 text-sm" aria-live="polite">
          {error && <span className="text-rose-400">{error}</span>}
          {success && <span className="text-emerald-400">{success}</span>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-full bg-white px-7 py-2.5 font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  )
}