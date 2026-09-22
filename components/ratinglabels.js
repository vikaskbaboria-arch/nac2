// Anchors: 3 = Worst, 5 = Timepass, 6 = Good, 8 = Go for it, 10 = Masterpiece.
// Gaps between them are filled in so every 0.5 step has a label.
export const RATING_LABELS = [
  { max: 2, label: "Awful", tone: "text-rose-400" },
  { max: 3.5, label: "Worst", tone: "text-rose-400" },
  { max: 4.5, label: "Meh", tone: "text-orange-400" },
  { max: 5.5, label: "Timepass", tone: "text-blue-300" },
  { max: 6.5, label: "Good", tone: "text-blue-400" },
  { max: 7.5, label: "Great", tone: "text-violet-400" },
  { max: 8.5, label: "Go for it", tone: "text-violet-300" },
  { max: 9.5, label: "Excellent", tone: "text-emerald-400" },
  { max: 10, label: "Masterpiece", tone: "text-emerald-300" },
]

export function getRatingMeta(rating) {
  return (
    RATING_LABELS.find((b) => rating <= b.max) ??
    RATING_LABELS[RATING_LABELS.length - 1]
  )
}