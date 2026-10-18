import Link from "next/link";
import { ArrowLeft, Megaphone } from "lucide-react";

export default function AdvertisePage() {
  return (
    <main className="blackgreengrad min-h-screen px-4 pb-16 pt-24 text-white sm:px-8">
      <section className="mx-auto max-w-3xl">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white">
          <ArrowLeft size={16} /> Home
        </Link>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <Megaphone className="text-violet-300" aria-hidden="true" />
          <p className="mt-5 text-sm font-medium text-violet-300">Partnerships</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Advertise with Us</h1>
          <p className="mt-4 leading-7 text-white/65">
            NAC is a movie and television discovery community. If you are
            interested in a brand partnership or advertising opportunity,
            please get in touch with a short description of your proposal.
          </p>
          <p className="mt-4 leading-7 text-white/65">
            Advertising options and availability are not currently listed on
            this page. Visit <Link href="/contact" className="text-violet-300 hover:underline">Contact Us</Link> with
            your inquiry.
          </p>
        </div>
      </section>
    </main>
  );
}
