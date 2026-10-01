import Link from "next/link";
import { Languages } from "lucide-react";
import { LANGUAGES } from "@/lib/languages";

export default function LanguagesPage() {
  return (
    <main className="min-h-[70vh] w-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Explore
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            Languages
          </h1>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {LANGUAGES.map((language, index) => (
            <Link
              key={language.value}
              href={`/discovery?language=${language.value}`}
              className="group flex min-h-28 flex-col items-start justify-between overflow-hidden rounded-lg border border-white/10 bg-white/5 p-4 text-white shadow-md shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-lg hover:shadow-black/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-36 sm:p-5"
            >
              <Languages className="size-6 text-white/75 transition-colors group-hover:text-white sm:size-7" aria-hidden="true" />
              <div className="flex w-full items-end justify-between gap-2">
                <span className="text-lg font-bold sm:text-xl">{language.label}</span>
                <span className="text-xs font-semibold tabular-nums text-white/40 transition-colors group-hover:text-white/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}