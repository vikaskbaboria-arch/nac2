const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-800/80 rounded ${className}`} />
);

const SeriesSkeleton = () => {
  return (
    <div className="w-full overflow-x-hidden bg-black text-white">
      
      {/* HERO */}
      <Skeleton className="h-[70vh] md:h-[80vh] w-full" />

      {/* POSTER + DETAILS */}
      <div className="relative grid md:grid-cols-[240px_1fr] gap-6 px-6 sm:px-12 mt-6 md:-mt-64 md:ml-28">
        
        <Skeleton className="w-36 sm:w-40 md:w-52 h-[320px] mx-auto md:mx-0" />

        <div className="flex flex-col gap-4 md:mt-40">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="px-6 sm:px-12 lg:px-36 py-12">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* CAST */}
      <div className="px-6 sm:px-12 pb-12">
        <Skeleton className="h-6 w-24 mb-4" />

        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-24 sm:w-32">
              <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto" />
              <Skeleton className="h-3 w-full mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeriesSkeleton;
