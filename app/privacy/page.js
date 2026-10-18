import Link from "next/link";

const sections = [
  {
    title: "Information you provide",
    body: "When you sign in or use community features, you may provide account details, profile information, reviews, ratings, collection entries, and messages or other content you choose to post.",
  },
  {
    title: "How information is used",
    body: "Information is used to operate and maintain NAC, show your profile and contributions, provide features you request, protect the service, and respond to support or moderation requests.",
  },
  {
    title: "Third-party services",
    body: "NAC uses third-party services for features such as authentication, analytics, and movie and television metadata. Those services may process information under their own privacy policies. Title information and images may be supplied by TMDB; NAC is not endorsed or certified by TMDB.",
  },
  {
    title: "Visibility and retention",
    body: "Profile details and content you post may be visible to other users according to the feature's design. We retain information for as long as needed to provide the service, meet operational needs, and address safety or legal issues. Do not post information you want to keep private.",
  },
  {
    title: "Your choices and questions",
    body: "You can review and update certain profile information through your account. For questions about privacy or a request concerning your information, please use the Contact Us page.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="blackgreengrad min-h-screen px-4 pb-16 pt-24 text-white sm:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-violet-300">NAC policies</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
        <p className="mt-4 leading-7 text-white/65">
          This page explains, in general terms, how information is handled when
          you use Not a Critic (NAC). The information and features available on
          the service may change as NAC develops.
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
