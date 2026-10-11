"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Flag, RefreshCw } from "lucide-react";

const STATUS_OPTIONS = [
  ["pending", "Pending"],
  ["in_review", "In review"],
  ["resolved", "Resolved"],
  ["dismissed", "Dismissed"],
];

const REASON_LABELS = {
  inaccurate_information: "Inaccurate information",
  inappropriate_content: "Inappropriate content",
  spam: "Spam",
  harassment: "Harassment",
  not_available: "Not available",
  incorrect_provider: "Incorrect provider",
  wrong_region: "Wrong region",
  other: "Other",
};

const TYPE_LABELS = {
  review: "Review",
  movie: "Movie",
  movie_info: "Movie information",
  provider: "Streaming provider",
  space: "Space post",
};

function reportLink(report) {
  if (report.targetType === "space") return "/space";
  if (report.mediaId) {
    return `/movie/${report.mediaId}?type=${report.mediaType || "movie"}`;
  }
  return null;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [noteDrafts, setNoteDrafts] = useState({});

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/reports", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to load reports.");
      }
      setReports(data.reports || []);
      setNoteDrafts(
        Object.fromEntries((data.reports || []).map((report) => [report._id, report.adminNote || ""]))
      );
    } catch (loadError) {
      setError(loadError.message || "Unable to load reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  async function updateReport(report, updates) {
    setBusyId(report._id);
    setError("");
    try {
      const response = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: report._id, ...updates }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to update report.");
      }
      setReports((current) =>
        current.map((item) => (item._id === report._id ? data.report : item))
      );
      setNoteDrafts((current) => ({
        ...current,
        [report._id]: data.report.adminNote || "",
      }));
    } catch (updateError) {
      setError(updateError.message || "Unable to update report.");
    } finally {
      setBusyId("");
    }
  }

  const pendingCount = reports.filter((report) => report.status === "pending").length;

  return (
    <main className="blackgreengrad min-h-screen px-4 pb-16 pt-24 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="mb-3 inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
            >
              <ArrowLeft size={16} /> Admin console
            </Link>
            <h1 className="flex items-center gap-3 text-2xl font-bold sm:text-3xl">
              <Flag className="text-violet-300" /> Reports
            </h1>
            <p className="mt-1 text-sm text-white/50">
              {pendingCount} pending · {reports.length} total
            </p>
          </div>
          <button
            type="button"
            onClick={loadReports}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75 transition hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </header>

        {error && (
          <div className="mb-5 rounded-xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
            {error}
          </div>
        )}

        {loading ? (
          <p className="py-16 text-center text-sm text-white/50">Loading reports…</p>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-16 text-center">
            <p className="text-lg font-medium">No reports yet</p>
            <p className="mt-1 text-sm text-white/50">New user reports will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => {
              const href = reportLink(report);
              const isBusy = busyId === report._id;
              return (
                <article
                  key={report._id}
                  className="rounded-2xl border border-white/10 bg-[#101014]/90 p-4 shadow-xl sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-2.5 py-1 text-xs text-violet-200">
                          {TYPE_LABELS[report.targetType] || report.targetType}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70">
                          {REASON_LABELS[report.reason] || report.reason}
                        </span>
                      </div>
                      <h2 className="break-words text-lg font-semibold">{report.targetTitle}</h2>
                      {report.providerName && (
                        <p className="mt-1 text-sm text-white/60">
                          Provider: {report.providerName}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-white/45">
                        Reported by {report.reportedBy?.username || report.reportedBy?.email || "User"}
                        {" · "}
                        {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <label className="flex shrink-0 items-center gap-2 text-sm text-white/60">
                      Status
                      <select
                        value={report.status}
                        disabled={isBusy}
                        onChange={(event) =>
                          updateReport(report, {
                            status: event.target.value,
                            adminNote: report.adminNote || "",
                          })
                        }
                        className="rounded-lg border border-white/10 bg-[#1b1b20] px-2.5 py-2 text-sm text-white outline-none focus:border-violet-400 disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {report.targetContent && (
                    <div className="mt-4 rounded-xl border border-white/5 bg-black/30 p-3">
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                        Reported content
                      </p>
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-white/75">
                        {report.targetContent}
                      </p>
                    </div>
                  )}
                  {report.details && (
                    <div className="mt-3 rounded-xl border border-amber-300/10 bg-amber-300/[0.04] p-3">
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-amber-200/60">
                        Reporter details
                      </p>
                      <p className="whitespace-pre-wrap break-words text-sm text-white/80">
                        {report.details}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                    <label className="min-w-[min(100%,20rem)] flex-1 text-xs text-white/50">
                      Internal admin note
                      <textarea
                        rows={2}
                        maxLength={1000}
                        value={noteDrafts[report._id] || ""}
                        onChange={(event) =>
                          setNoteDrafts((current) => ({
                            ...current,
                            [report._id]: event.target.value,
                          }))
                        }
                        placeholder="Private moderation note"
                        className="mt-1.5 block w-full resize-y rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-white/25 focus:border-violet-400"
                      />
                    </label>
                    <div className="flex items-center gap-3">
                      {href && (
                        <Link
                          href={href}
                          className="inline-flex items-center gap-1.5 text-xs text-violet-200 hover:text-violet-100"
                        >
                          Open related content <ExternalLink size={13} />
                        </Link>
                      )}
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() =>
                          updateReport(report, {
                            status: report.status,
                            adminNote: noteDrafts[report._id] || "",
                          })
                        }
                        className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
                      >
                        {isBusy ? "Saving…" : "Save note"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
