import Link from "next/link";
import { COUNTRIES } from "@/lib/countries";

export default function CountriesPage() {
  const countries = COUNTRIES.filter((country) => country.value !== "all");

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Explore
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Countries
        </h1>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {countries.map((country) => (
          <Link
            key={country.value}
            href={`/explore/country/${country.value}`}
            className="flex min-h-24 items-end rounded-lg border border-white/15 bg-gradient-to-br from-white/[0.09] to-white/[0.02] p-4 text-lg font-bold text-white transition-colors hover:border-white/40 hover:from-white/[0.15] sm:min-h-32 sm:p-5 sm:text-xl"
          >
            {country.label}
          </Link>
        ))}
      </div>
    </main>
  );
}