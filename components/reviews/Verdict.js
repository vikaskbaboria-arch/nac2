
// Shared by ReviewForm and Reviewdata.
// Keep this file in the same folder as those two components so Tailwind
// picks up the class names below.
//
// `rating` is the number sent to /api/review when the verdict is picked.
 
export const VERDICTS = [
  {
    key: "skip",
    label: "Skip",
    badgeLabel: "Skip",
    rating: 3,
    active: "bg-rose-500 text-white",
    badge: "bg-rose-500 text-white",
  },
  {
    key: "timepass",
    label: "Timepass",
    badgeLabel: "Timepass",
    rating: 5,
    active: "bg-[#FFB800] text-black",
    badge: "bg-[#FFB800] text-black",
  },
  {
    key: "go",
    label: "Go for it",
    badgeLabel: "Go For It",
    rating: 8,
    active: "bg-[#10d9a0] text-black",
    badge: "bg-[#10d9a0] text-black",
  },
  {
    key: "perfection",
    label: "Perfection",
    badgeLabel: "Perfection",
    rating: 10,
    active: "bg-purple-500 text-white",
    badge: "bg-purple-500 text-white",
  },
]
 
// Maps any stored numeric rating (0.5 - 10, including old slider values)
// to one of the four verdicts.
export function verdictOf(rating = 0) {
  if (rating <= 4) return VERDICTS[0]
  if (rating <= 6.5) return VERDICTS[1]
  if (rating <= 8.5) return VERDICTS[2]
  return VERDICTS[3]
}