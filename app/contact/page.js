import Link from "next/link";
import { ArrowLeft, Flag, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="blackgreengrad min-h-screen px-4 pb-16 pt-24 text-white sm:px-8">
      <section className="mx-auto max-w-3xl">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white">
          <ArrowLeft size={16} /> Home
        </Link>
        <p className="text-sm font-medium text-violet-300">We’re here to help</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Contact Us</h1>
        <p className="mt-4 max-w-2xl leading-7 text-white/65">
          Need help with NAC, have feedback, or spotted a problem? Choose the
          option that best fits your request.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <MessageCircle className="text-violet-300" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold">General questions and feedback</h2>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Tell us what you think about the site or ask a question about
              using its features.
            </p>
            <Link href="/about" className="mt-4 inline-block text-sm font-medium text-violet-300 hover:underline">
              Learn about NAC
            </Link>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <Flag className="text-violet-300" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold">Report a problem</h2>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Use the report option on a review, title, or community post to
              flag content for the moderation team.
            </p>
            <Link href="/reports" className="mt-4 inline-block text-sm font-medium text-violet-300 hover:underline">
              View my reports
            </Link>
          </article>
        </div>
        <p className="mt-6 text-sm leading-6 text-white/45">
          For privacy questions, see our <Link href="/privacy" className="text-violet-300 hover:underline">Privacy Policy</Link>.
        </p>
      </section>
    </main>
  );
}
