"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Flag } from "lucide-react";

const STATUS_LABELS = {
  pending: "Pending",
  in_review: "In review",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

const TYPE_LABELS = {
  review: "Review",
  movie: "Movie",
  movie_info: "Movie information",
  provider: "Streaming provider",
  space: "Space post",
};

export default function MyReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/report", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to load your reports.");
      }
      setReports(data.reports || []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load your reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  return (
    <main className="blackgreengrad min-h-screen px-4 pb-16 pt-24 text-white sm:px-8">
      <section className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
        >
          <ArrowLeft size={16} /> Home
        </Link>
        <h1 className="flex items-center gap-3 text-2xl font-bold">
          <Flag className="text-violet-300" /> My reports
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Only you and the moderation team can see these reports.
        </p>

        {error && (
          <p className="mt-6 rounded-xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
            {error}
          </p>
        )}
        {loading ? (
          <p className="py-16 text-center text-sm text-white/50">Loading your reports…</p>
        ) : reports.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="font-medium">You haven&apos;t submitted any reports.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {reports.map((report) => (
              <article
                key={report._id}
                className="rounded-2xl border border-white/10 bg-[#101014]/90 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-violet-200">
                    {TYPE_LABELS[report.targetType] || report.targetType}
                  </p>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/65">
                    {STATUS_LABELS[report.status] || report.status}
                  </span>
                </div>
                <h2 className="mt-2 font-semibold">{report.targetTitle}</h2>
                {report.providerName && (
                  <p className="mt-1 text-sm text-white/60">
                    Provider: {report.providerName}
                  </p>
                )}
                <p className="mt-2 text-xs text-white/40">
                  Submitted {new Date(report.createdAt).toLocaleString()}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
