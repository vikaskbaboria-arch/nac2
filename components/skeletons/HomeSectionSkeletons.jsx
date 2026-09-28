export const SkeletonBlock = ({ className = "" }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-lg bg-white/[0.08] ${className}`}
  />
);

function PosterCardSkeleton() {
  return (
    <div className="w-full p-1">
      <SkeletonBlock className="aspect-[2/3] w-full rounded-lg" />
      <SkeletonBlock className="mt-3 h-4 w-4/5" />
      <SkeletonBlock className="mt-2 h-3 w-2/5" />
    </div>
  );
}

function PosterGridSkeleton({ titleWidth = "w-48", count = 5, label = "movie collection" }) {
  return (
    <section aria-busy="true" aria-label={`Loading ${label}`} className="w-full">
      <SkeletonBlock className={`mb-2 ml-6 h-7 ${titleWidth}`} />
      <div className="grid w-full grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-4 sm:p-3 lg:grid-cols-5">
        {Array.from({ length: count }, (_, index) => (
          <PosterCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

export function TrendingSkeleton() {
  return <PosterGridSkeleton count={10} label="trending movies" />;
}

export function EditorsPickSkeleton() {
  return <PosterGridSkeleton count={5} titleWidth="w-40" label="editor's picks" />;
}

export function ProviderRowSkeleton() {
  return <PosterGridSkeleton count={5} titleWidth="w-56" label="provider titles" />;
}

export function SearchGridSkeleton({ count = 10 }) {
  return <PosterGridSkeleton count={count} label="search results" />;
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
      <SkeletonBlock className="mb-3 ml-3 h-7 w-44" />
      <div className="flex gap-4 overflow-hidden px-3 py-3">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="w-[38vw] shrink-0 sm:w-[22vw] lg:w-40">
            <SkeletonBlock className="aspect-[2/3] w-full rounded-xl" />
            <SkeletonBlock className="mt-3 h-4 w-4/5" />
            <SkeletonBlock className="mt-2 h-3 w-2/5" />
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
        <div key={index} className="flex gap-6 rounded-xl bg-gray-900/40 p-4 sm:p-6">
          <SkeletonBlock className="w-28 shrink-0 aspect-[2/3] sm:w-33 md:w-36 lg:w-42 xl:w-44" />
          <div className="flex min-w-0 flex-1 flex-col gap-4 py-1">
            <SkeletonBlock className="h-6 w-3/5" />
            <SkeletonBlock className="h-4 w-1/4" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-5/6" />
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
        <div key={index} className="rounded-xl border border-white/10 bg-black p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-4 w-10" />
            <SkeletonBlock className="h-4 w-20" />
          </div>
          <SkeletonBlock className="mt-4 h-4 w-full" />
          <SkeletonBlock className="mt-2 h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
}

export function ChatListSkeleton({ count = 5 }) {
  return (
    <div aria-busy="true" aria-label="Loading conversations" className="divide-y divide-white/5">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center gap-4 bg-slate-950 px-4 py-3">
          <SkeletonBlock className="h-11 w-11 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1">
            <SkeletonBlock className="h-4 w-2/5" />
            <SkeletonBlock className="mt-2 h-3 w-4/5" />
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
        <div>
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="mt-2 h-3 w-16" />
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-6 py-6">
        <SkeletonBlock className="h-12 w-3/5 self-start rounded-lg" />
        <SkeletonBlock className="h-12 w-1/2 self-end rounded-lg" />
        <SkeletonBlock className="h-16 w-2/3 self-start rounded-lg" />
      </div>
      <SkeletonBlock className="mb-3 h-11 w-full rounded-md" />
    </div>
  );
}

export function CreditRailSkeleton({ count = 5 }) {
  return (
    <div aria-busy="true" aria-label="Loading credits" className="flex gap-4 overflow-hidden py-4 sm:gap-6">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="w-24 shrink-0 sm:w-32 md:w-36">
          <SkeletonBlock className="mx-auto aspect-square w-full rounded-full" />
          <SkeletonBlock className="mx-auto mt-2 h-3 w-4/5" />
          <SkeletonBlock className="mx-auto mt-2 h-3 w-3/5" />
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
          <div key={index} className="flex min-h-64 flex-col justify-between gap-8 rounded-xl border border-white/10 bg-black p-6">
            <div>
              <SkeletonBlock className="h-4 w-2/3" />
              <SkeletonBlock className="mt-6 h-5 w-full" />
              <SkeletonBlock className="mt-2 h-5 w-4/5" />
              <SkeletonBlock className="mt-2 h-5 w-3/5" />
            </div>
            <div className="flex items-center gap-3">
              <SkeletonBlock className="h-9 w-9 rounded-full" />
              <div className="flex-1">
                <SkeletonBlock className="h-4 w-1/3" />
                <SkeletonBlock className="mt-2 h-3 w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RatingSkeleton() {
  return <SkeletonBlock className="h-6 w-12 rounded-md" />;
}

export function SearchSuggestionsSkeleton({ count = 3 }) {
  return (
    <div aria-busy="true" aria-label="Loading search suggestions" className="absolute mt-2 w-full rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center gap-3 p-2">
          <SkeletonBlock className="h-12 w-8 shrink-0 rounded-md" />
          <SkeletonBlock className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function HeroCarouselSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading featured titles" className="px-4 pt-32 sm:px-13">
      <SkeletonBlock className="mx-auto aspect-video w-full rounded-lg" />
    </div>
  );
}

export function RetroTvSkeleton() {
  return (
    <div className="w-full px-4 pt-8 pb-4 sm:pt-14" aria-busy="true" aria-label="Loading featured show">
      <div className="crt-set mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 sm:flex-row sm:gap-6 sm:p-6">
        <SkeletonBlock className="aspect-video flex-1 rounded-md" />
        <div className="flex items-center justify-between gap-4 sm:w-20 sm:flex-col sm:justify-center">
          <SkeletonBlock className="h-9 w-9 rounded-full sm:h-12 sm:w-12" />
          <div className="flex gap-2 sm:flex-col">
            <SkeletonBlock className="h-7 w-12 rounded" />
            <SkeletonBlock className="h-7 w-12 rounded" />
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
      className="w-full min-w-0 overflow-hidden rounded-lg border border-white/20 bg-white/[0.03] lg:h-[626px] lg:rounded-2xl lg:p-6"
    >
      <div className="border-b border-white/10 px-4 py-3 lg:border-0 lg:p-0">
        <SkeletonBlock className="h-6 w-44" />
        <SkeletonBlock className="mt-2 h-3 w-52" />
      </div>
      <div className="scrollbar-hidden flex gap-3 overflow-x-auto px-3 py-3 lg:mt-8 lg:block lg:h-[520px] lg:space-y-3 lg:overflow-x-hidden lg:overflow-y-auto lg:px-0 lg:py-0">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex w-[min(78vw,280px)] shrink-0 gap-3 rounded-lg bg-white/[0.02] p-2.5 lg:w-full lg:rounded-xl lg:p-3">
            <SkeletonBlock className="h-[82px] w-[56px] shrink-0 rounded-lg lg:h-[95px] lg:w-[65px]" />
            <div className="flex flex-1 flex-col justify-between py-1">
              <div>
                <SkeletonBlock className="h-4 w-3/4" />
                <SkeletonBlock className="mt-2 h-3 w-1/3" />
              </div>
              <SkeletonBlock className="h-3 w-1/2" />
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
        <div key={index} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <SkeletonBlock className="h-4 w-6" />
          <SkeletonBlock className="h-16 w-12 shrink-0 rounded-lg" />
          <div className="flex-1">
            <SkeletonBlock className="h-4 w-2/5" />
            <SkeletonBlock className="mt-2 h-3 w-1/3" />
            <SkeletonBlock className="mt-2 h-3 w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
}