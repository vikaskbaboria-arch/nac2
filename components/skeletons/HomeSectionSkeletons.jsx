export const SkeletonBlock = ({ className = "" }) => (
  <div
    aria-hidden="true"
    className={`skeleton-shimmer rounded-xl border border-white/[0.06] ${className}`}
  />
);

function PosterCardSkeleton() {
  return (
    <div className="w-full rounded-xl p-2 transition-colors">
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl skeleton-shimmer border border-white/[0.08] shadow-lg shadow-black/40">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>
      {/* Title */}
      <div className="mt-2.5 h-4 w-4/5 rounded-md skeleton-shimmer border border-white/[0.05]" />
      {/* Subtitle / tag */}
      <div className="mt-2 h-3 w-2/5 rounded-md skeleton-shimmer border border-white/[0.04]" />
    </div>
  );
}

function PosterGridSkeleton({ titleWidth = "w-48", count = 5, label = "movie collection" }) {
  return (
    <section aria-busy="true" aria-label={`Loading ${label}`} className="w-full">
      <div className="mb-3 px-6">
        <SkeletonBlock className={`h-7 sm:h-8 ${titleWidth}`} />
      </div>
      <div className="relative grid w-full grid-cols-2 gap-1 rounded-xl sm:gap-4 sm:p-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: count }, (_, index) => (
          <PosterCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

export function TrendingSkeleton() {
  return <PosterGridSkeleton count={10} titleWidth="w-52" label="trending movies" />;
}

export function EditorsPickSkeleton() {
  return <PosterGridSkeleton count={5} titleWidth="w-44" label="editor's picks" />;
}

export function ProviderRowSkeleton() {
  return <PosterGridSkeleton count={5} titleWidth="w-64" label="provider titles" />;
}

export function SearchGridSkeleton({ count = 10 }) {
  return <PosterGridSkeleton count={count} titleWidth="w-40" label="search results" />;
}

export function WatchlistGridSkeleton({ count = 10 }) {
  return (
    <div aria-busy="true" aria-label="Loading watchlist" className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }, (_, index) => (
        <PosterCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function PosterRailSkeleton({ label = "titles", count = 5 }) {
  return (
    <section aria-busy="true" aria-label={`Loading ${label}`} className="w-full">
      <div className="mb-3 px-6">
        <SkeletonBlock className="h-7 sm:h-8 w-48" />
      </div>
      <div className="relative flex w-full gap-4 overflow-hidden p-3 rounded-xl">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="w-[38vw] shrink-0 sm:w-[22vw] lg:w-44 p-2 rounded-xl">
            <div className="aspect-[2/3] w-full rounded-xl skeleton-shimmer border border-white/[0.08] shadow-lg shadow-black/40" />
            <div className="mt-2.5 h-4 w-4/5 rounded-md skeleton-shimmer border border-white/[0.05]" />
            <div className="mt-2 h-3 w-2/5 rounded-md skeleton-shimmer border border-white/[0.04]" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function MediaListSkeleton({ label = "titles", count = 5 }) {
  return (
    <div aria-busy="true" aria-label={`Loading ${label}`} className="w-full space-y-6 px-4 py-8 sm:px-8">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex gap-4 sm:gap-6 rounded-xl border border-white/10 bg-gradient-to-r from-white/[0.03] to-white/[0.01] p-4 sm:p-6 shadow-xl backdrop-blur-xl">
          <SkeletonBlock className="w-24 sm:w-28 md:w-36 lg:w-42 shrink-0 aspect-[2/3] rounded-xl shadow-lg" />
          <div className="flex min-w-0 flex-1 flex-col gap-3 py-1">
            <SkeletonBlock className="h-6 sm:h-7 w-3/5 rounded-lg" />
            <SkeletonBlock className="h-4 w-28 rounded-md" />
            <div className="space-y-2 mt-2">
              <SkeletonBlock className="h-4 w-full rounded-md" />
              <SkeletonBlock className="h-4 w-5/6 rounded-md" />
              <SkeletonBlock className="h-4 w-3/4 rounded-md hidden sm:block" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReviewListSkeleton({ count = 3 }) {
  return (
    <div aria-busy="true" aria-label="Loading reviews" className="mt-6 max-w-5xl space-y-4 text-white">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="rounded-2xl border border-white/10 bg-[#0c0c0e]/90 p-4 sm:p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-9 w-9 rounded-full" />
            <div className="space-y-1.5">
              <SkeletonBlock className="h-4 w-28 rounded-md" />
              <SkeletonBlock className="h-3 w-16 rounded-md" />
            </div>
          </div>
          <SkeletonBlock className="mt-4 h-4 w-full rounded-md" />
          <SkeletonBlock className="mt-2.5 h-4 w-4/5 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function ChatListSkeleton({ count = 5 }) {
  return (
    <div aria-busy="true" aria-label="Loading conversations" className="divide-y divide-white/5">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center gap-4 bg-slate-950/80 px-4 py-3.5 backdrop-blur-xl">
          <SkeletonBlock className="h-11 w-11 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonBlock className="h-4 w-2/5 rounded-md" />
            <SkeletonBlock className="h-3 w-4/5 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MessageThreadSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading messages" className="flex h-[calc(100dvh-4rem)] min-h-0 flex-col bg-[#0b0b0c] px-4 text-white sm:px-6">
      <div className="flex items-center gap-3 border-b border-white/5 py-3">
        <SkeletonBlock className="h-10 w-10 rounded-full" />
        <div className="space-y-1.5">
          <SkeletonBlock className="h-4 w-32 rounded-md" />
          <SkeletonBlock className="h-3 w-16 rounded-md" />
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-6 py-6">
        <SkeletonBlock className="h-12 w-3/5 self-start rounded-2xl" />
        <SkeletonBlock className="h-12 w-1/2 self-end rounded-2xl" />
        <SkeletonBlock className="h-16 w-2/3 self-start rounded-2xl" />
      </div>
      <SkeletonBlock className="mb-3 h-11 w-full rounded-xl" />
    </div>
  );
}

export function CreditRailSkeleton({ count = 5 }) {
  return (
    <div aria-busy="true" aria-label="Loading credits" className="flex gap-4 overflow-hidden py-4 sm:gap-6">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="w-24 shrink-0 sm:w-32 md:w-36 flex flex-col items-center">
          <SkeletonBlock className="mx-auto aspect-square w-full rounded-full shadow-lg" />
          <SkeletonBlock className="mx-auto mt-3 h-3.5 w-4/5 rounded-md" />
          <SkeletonBlock className="mx-auto mt-2 h-3 w-3/5 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function ProfileReviewsSkeleton() {
  return (
    <section aria-busy="true" aria-label="Loading profile reviews" className="bg-black py-8 mt-6 sm:py-16">
      <div className="container-page grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex min-h-64 flex-col justify-between gap-8 rounded-2xl border border-white/10 bg-[#0d0d10] p-6 shadow-2xl backdrop-blur-xl">
            <div>
              <SkeletonBlock className="h-4 w-2/3 rounded-md" />
              <SkeletonBlock className="mt-6 h-5 w-full rounded-md" />
              <SkeletonBlock className="mt-2.5 h-5 w-4/5 rounded-md" />
              <SkeletonBlock className="mt-2.5 h-5 w-3/5 rounded-md" />
            </div>
            <div className="flex items-center gap-3">
              <SkeletonBlock className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <SkeletonBlock className="h-4 w-1/3 rounded-md" />
                <SkeletonBlock className="h-3 w-1/4 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RatingSkeleton() {
  return <SkeletonBlock className="h-6 w-12 rounded-lg" />;
}

export function SearchSuggestionsSkeleton({ count = 3 }) {
  return (
    <div aria-busy="true" aria-label="Loading search suggestions" className="absolute mt-2 w-full rounded-2xl border border-white/10 bg-black/90 p-2 backdrop-blur-2xl shadow-2xl">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center gap-3 p-2 rounded-xl">
          <SkeletonBlock className="h-12 w-8 shrink-0 rounded-lg" />
          <SkeletonBlock className="h-4 w-2/3 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function HeroCarouselSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading featured titles" className="px-4 pt-32 sm:px-13">
      <div className="mx-auto aspect-video w-full rounded-2xl overflow-hidden skeleton-shimmer border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 space-y-2">
          <div className="h-6 sm:h-8 w-60 rounded-lg skeleton-shimmer border border-white/10" />
          <div className="h-4 w-32 rounded-md skeleton-shimmer border border-white/10" />
        </div>
      </div>
    </div>
  );
}

export function RetroTvSkeleton() {
  return (
    <div className="w-full px-4 pt-8 pb-4 sm:pt-14" aria-busy="true" aria-label="Loading featured show">
      <div className="crt-set mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 sm:flex-row sm:gap-6 sm:p-6 rounded-2xl border border-white/10 bg-[#0d0d10]/80 backdrop-blur-xl">
        <SkeletonBlock className="aspect-video flex-1 rounded-xl" />
        <div className="flex items-center justify-between gap-4 sm:w-20 sm:flex-col sm:justify-center">
          <SkeletonBlock className="h-9 w-9 rounded-full sm:h-12 sm:w-12" />
          <div className="flex gap-2 sm:flex-col">
            <SkeletonBlock className="h-7 w-12 rounded-lg" />
            <SkeletonBlock className="h-7 w-12 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function InterestedPanelSkeleton() {
  return (
    <aside
      aria-busy="true"
      aria-label="Loading most interested movies"
      className="
        w-full min-w-0 overflow-hidden rounded-lg
        border border-white/20
        bg-gradient-to-b from-black/60 to-black/30
        backdrop-blur-2xl
        shadow-[0_0_40px_rgba(0,0,0,0.6)]
        lg:h-[626px] lg:rounded-2xl
      "
    >
      <div className="lg:border-b border-white/20 px-6 pt-3 pb-2 sm:px-6 lg:py-4">
        <div className="h-5 sm:h-6 w-36 rounded-md skeleton-shimmer border border-white/10" />
        <div className="mt-1.5 h-3 w-44 rounded-md skeleton-shimmer border border-white/[0.06]" />
      </div>
      <div className="scrollbar-hidden flex gap-3 overflow-x-auto px-3 py-3 lg:block lg:h-[520px] lg:space-y-3 lg:overflow-x-hidden lg:overflow-y-auto lg:px-4 lg:py-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="
              flex w-full max-w-[430px] shrink-0 gap-3 rounded-lg p-2.5 px-2
              bg-[#070606]
              border border-violet-300/20
              shadow-[0_0_12px_rgba(167,139,250,0.08)]
              backdrop-blur-2xl
              lg:w-full lg:rounded-xl lg:p-3
            "
          >
            <div className="h-[82px] w-[56px] shrink-0 rounded-lg lg:h-[95px] lg:w-[65px] skeleton-shimmer border border-white/10 shadow-md" />
            <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
              <div>
                <div className="h-4 w-3/4 rounded-md skeleton-shimmer border border-white/10" />
                <div className="mt-1.5 h-3 w-1/3 rounded-md skeleton-shimmer border border-white/[0.06]" />
              </div>
              <div className="h-3 w-24 rounded-md skeleton-shimmer border border-violet-400/20" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function AdminRowsSkeleton({ count = 3, label = "curated titles" }) {
  return (
    <div aria-busy="true" aria-label={`Loading ${label}`} className="flex flex-col gap-3">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 shadow-lg">
          <SkeletonBlock className="h-4 w-6 rounded-md" />
          <SkeletonBlock className="h-16 w-12 shrink-0 rounded-lg shadow-md" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-4 w-2/5 rounded-md" />
            <SkeletonBlock className="h-3 w-1/3 rounded-md" />
            <SkeletonBlock className="h-3 w-3/5 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}