import Link from "next/link";

const sections = [
  {
    title: "Using NAC",
    body: "Use NAC lawfully and respectfully. You are responsible for activity through your account and for keeping your sign-in credentials secure. Do not interfere with the service, attempt unauthorized access, or misuse its features.",
  },
  {
    title: "Community content",
    body: "You retain responsibility for reviews, ratings, profile information, and other material you submit. Only post material you have the right to share. Do not post unlawful, abusive, misleading, or privacy-invasive content. NAC may remove content or restrict accounts when needed to protect the community or operate the service.",
  },
  {
    title: "Third-party information",
    body: "Movie and television data, availability information, and related images may come from third-party services and can be incomplete, out of date, or subject to change. NAC does not guarantee their accuracy or availability. Third-party services are governed by their own terms.",
  },
  {
    title: "Service availability",
    body: "NAC is provided as-is and may change, be interrupted, or become unavailable. To the extent allowed by applicable law, NAC disclaims warranties and is not liable for indirect or consequential loss arising from use of the service.",
  },
  {
    title: "Changes and questions",
    body: "These terms may be updated as the service evolves. Continued use after updated terms are posted means you accept the revised terms. If you have a question, please use the Contact Us page.",
  },
];

export default function TermsPage() {
  return (
    <main className="blackgreengrad min-h-screen px-4 pb-16 pt-24 text-white sm:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-violet-300">NAC policies</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Terms of Service</h1>
        <p className="mt-4 leading-7 text-white/65">
          By accessing or using Not a Critic (NAC), you agree to these terms.
          If you do not agree, please do not use the service.
        </p>
        <div className="mt-8 space-y-4">
          {sections.map(({ title, body }) => (
            <section key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 leading-7 text-white/60">{body}</p>
            </section>
          ))}
        </div>
        <p className="mt-6 text-sm text-white/50">
          For questions, visit <Link href="/contact" className="text-violet-300 hover:underline">Contact Us</Link>.
        </p>
      </article>
    </main>
  );
}
