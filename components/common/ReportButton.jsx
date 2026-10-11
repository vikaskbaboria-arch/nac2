"use client";

import { useState } from "react";
import Link from "next/link";
import { Flag, X } from "lucide-react";
import { useSession } from "next-auth/react";

const REASONS = [
  ["inaccurate_information", "Inaccurate information"],
  ["inappropriate_content", "Inappropriate content"],
  ["spam", "Spam"],
  ["harassment", "Harassment"],
  ["not_available", "Not available"],
  ["incorrect_provider", "Incorrect provider"],
  ["wrong_region", "Wrong region"],
  ["other", "Other"],
];

export default function ReportButton({
  targetType,
  targetId,
  targetTitle,
  targetContent = "",
  mediaId,
  mediaType,
  providerId,
  providerName,
  compact = false,
  className = "",
}) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("inaccurate_information");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);

  const close = () => {
    setOpen(false);
    setMessage("");
    setFailed(false);
    setDetails("");
  };

  async function submitReport(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setFailed(false);

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          targetId,
          targetTitle,
          targetContent,
          mediaId,
          mediaType,
          providerId,
          providerName,
          reason,
          details,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not submit this report.");
      }
      setMessage("Thanks. Your report has been sent to the moderation team.");
      setFailed(false);
    } catch (error) {
      setMessage(error.message || "Could not submit this report.");
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen(true);
        }}
        aria-label={`Report ${targetTitle || "content"}`}
        title={`Report ${targetTitle || "content"}`}
        className={
          className ||
          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/55 transition hover:bg-white/10 hover:text-white"
        }
      >
        <Flag size={14} />
        {!compact && <span>Report</span>}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={(event) => {
            event.stopPropagation();
            close();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-dialog-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111114] p-5 text-white shadow-2xl sm:p-6"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 id="report-dialog-title" className="text-lg font-semibold">
                  Report {targetType === "provider" ? "provider information" : "content"}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-white/55">{targetTitle}</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close report form"
                className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {!session?.user ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
                Sign in to send a report.{" "}
                <Link href="/login" className="text-violet-300 underline underline-offset-2">
                  Sign in
                </Link>
              </div>
            ) : (
              <form onSubmit={submitReport} className="space-y-4">
                <label className="block text-sm">
                  <span className="mb-1.5 block text-white/70">Reason</span>
                  <select
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#1b1b20] px-3 py-2.5 text-white outline-none focus:border-violet-400"
                  >
                    {REASONS.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm">
                  <span className="mb-1.5 block text-white/70">Additional details (optional)</span>
                  <textarea
                    value={details}
                    onChange={(event) => setDetails(event.target.value.slice(0, 1000))}
                    rows={4}
                    maxLength={1000}
                    placeholder="Tell us what needs attention."
                    className="w-full resize-y rounded-lg border border-white/10 bg-[#1b1b20] px-3 py-2.5 text-white outline-none placeholder:text-white/30 focus:border-violet-400"
                  />
                </label>

                {message && (
                  <p className={failed ? "text-sm text-rose-300" : "text-sm text-emerald-300"}>
                    {message}
                  </p>
                )}
                {message && !failed && (
                  <Link
                    href="/reports"
                    className="inline-block text-sm text-violet-300 underline underline-offset-2 hover:text-violet-200"
                  >
                    View my reports
                  </Link>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-lg px-4 py-2 text-sm text-white/70 hover:bg-white/10"
                  >
                    {message && !failed ? "Close" : "Cancel"}
                  </button>
                  {!(message && !failed) && (
                    <button
                      type="submit"
                      disabled={busy}
                      className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-wait disabled:opacity-60"
                    >
                      {busy ? "Sending…" : "Send report"}
                    </button>
                  )}
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}
