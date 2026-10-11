const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-white/[0.08] ${className}`} />
);

export default function HomeSkeleton() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#090909] text-white">
      <div className="px-4 pt-8 sm:px-13 sm:pt-12">
        <Skeleton className="mx-auto aspect-video w-full max-w-3xl rounded-2xl bg-[#241c15]" />
      </div>

      <div className="relative mx-auto grid max-w-[1500px] gap-8 px-8 pb-16 pt-6 lg:grid-cols-[4fr_2fr] lg:px-24">
        <div className="flex flex-col gap-10">
          {[10, 5, 5].map((count, sectionIndex) => (
            <section key={sectionIndex}>
              <Skeleton className="mb-4 h-7 w-48" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {Array.from({ length: count }).map((_, index) => (
                  <div key={index}>
                    <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                    <Skeleton className="mt-3 h-4 w-4/5" />
                    <Skeleton className="mt-2 h-3 w-2/5" />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <Skeleton className="hidden h-[626px] rounded-2xl lg:mt-14 lg:block" />
      </div>
    </div>
  );
}