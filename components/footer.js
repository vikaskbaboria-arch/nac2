import Link from "next/link";
import { Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

/* Generic stand-ins for brand marks. lucide-react only ships Instagram,
   so Discord/WhatsApp/Reddit are simplified glyphs — swap for an icon
   pack like simple-icons if you want the exact official logos. */
function DiscordIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.3 5.4A17.6 17.6 0 0 0 15.9 4a12 12 0 0 0-.6 1.2 16.3 16.3 0 0 0-4.6 0A12 12 0 0 0 10.1 4a17.7 17.7 0 0 0-4.4 1.4C3 9.6 2.3 13.7 2.6 17.7a17.8 17.8 0 0 0 5.4 2.7c.4-.6.8-1.2 1.1-1.9a11.4 11.4 0 0 1-1.8-.9l.4-.3a12.6 12.6 0 0 0 10.6 0l.4.3c-.6.3-1.2.6-1.8.9.3.7.7 1.3 1.1 1.9a17.7 17.7 0 0 0 5.4-2.7c.4-4.6-.7-8.7-3.1-12.3ZM9.7 15.2c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Zm4.6 0c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Z" />
    </svg>
  );
}

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17 14.2c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1a7.3 7.3 0 0 1-2.2-1.3 8 8 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.4v-.4c-.1-.1-.6-1.4-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1 0 1.3.9 2.5 1.1 2.7.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.6.6.2 1.2.1 1.6.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.1.2-1.2 0-.2-.2-.2-.5-.3ZM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Z" />
    </svg>
  );
}

function RedditIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12a2.2 2.2 0 0 0-3.7-1.6 10.6 10.6 0 0 0-4.9-1.6l.8-3.8 2.7.6a1.6 1.6 0 1 0 .2-.9l-3-.7a.4.4 0 0 0-.5.3l-.9 4.4a10.6 10.6 0 0 0-5 1.6A2.2 2.2 0 0 0 2 12c0 .8.4 1.5 1 1.9a3.6 3.6 0 0 0 0 .5c0 2.7 3.1 4.8 7 4.8s7-2.1 7-4.8v-.5a2.2 2.2 0 0 0 1-1.9Zm-14 1.2a1.3 1.3 0 1 1 2.6 0 1.3 1.3 0 0 1-2.6 0Zm7.6 3.4a4.9 4.9 0 0 1-3.1.9 4.9 4.9 0 0 1-3.1-.9.4.4 0 0 1 .5-.6c.6.5 1.6.8 2.6.8s2-.3 2.6-.8a.4.4 0 1 1 .5.6Zm-.3-2.1a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Z" />
    </svg>
  );
}

function GooglePlayGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M4 2.9c-.3.2-.5.6-.5 1v16.2c0 .4.2.8.5 1l9.3-9.1L4 2.9Z" fill="white" />
      <path d="M13.3 12 4 2.9c.1 0 .2 0 .3.1l11 6.3-2 2.7Z" fill="#00f076" />
      <path d="M4.3 21c-.1 0-.2 0-.3.1l9.3-9.1 2 2.7-11 6.3Z" fill="#ff3a44" />
      <path d="M15.3 9.3l2.9-1.7c.7-.4 1.2-.9 1.2-1.6s-.5-1.2-1.2-1.6l-2.9-1.7-2.4 2.9 2.4 2.7Z" fill="#ffcf00" />
      <path d="M15.3 14.7l-2.4 2.7 2.4 2.9 2.9-1.7c.7-.4 1.2-.9 1.2-1.6s-.5-1.2-1.2-1.6l-2.9-1.7Z" fill="#ffcf00" />
    </svg>
  );
}

function AppleGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="white" {...props}>
      <path d="M16.4 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2-1.4 2.5-.4 6.2 1 8.3.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.2-.8-2.2-3.2ZM14.3 6.1c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.6-1.1 1.7-.9 2.6.9.1 1.9-.5 2.6-1.2Z" />
    </svg>
  );
}

const DEFAULT_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Advertise with Us", href: "/advertise" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact Us", href: "/contact" },
];

const DEFAULT_SOCIALS = [
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "Discord", href: "https://discord.com", Icon: DiscordIcon },
  { label: "WhatsApp", href: "https://whatsapp.com", Icon: WhatsAppIcon },
  { label: "Reddit", href: "https://reddit.com", Icon: RedditIcon },
];

/**
 * <Footer />
 * <Footer company="Men of Culture Media Pvt. Ltd." links={links} socials={socials}
 *         playStoreHref="..." appStoreHref="..." />
 */
export function Footer({
  company = "Not a Critic Pvt. Ltd.",
  year = new Date().getFullYear(),
  links = DEFAULT_LINKS,
  socials = DEFAULT_SOCIALS,
  playStoreHref = "#",
  appStoreHref = "#",
  className,
}) {
  return (
    <footer className={cn("border-t border-gray-800 footerbg px-28 text-white/90", className)}>
      <div className="container-page py-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-sm font-semibold ">
              Made with <span aria-hidden="true">❤️</span>
              <span className="">love</span> in India
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={playStoreHref}
                className="flex items-center gap-2 rounded-md border border-gray-500 bg-black px-3 py-1.5 transition-colors hover:border-gray-100"
              >
                <GooglePlayGlyph className="size-5 shrink-0" aria-hidden="true" />
                <span className="leading-tight">
                  <span className="block text-[10px] text-muted-foreground">
                    GET IT ON
                  </span>
                  <span className="block text-sm font-medium text-white">
                    Google Play
                  </span>
                </span>
              </a>

              <a
                href={appStoreHref}
                className="flex items-center gap-2 rounded-md border border-gray-500 bg-black px-3 py-1.5 border-gray-300 transition-colors hover:border-gray-50"
              >
                <AppleGlyph className="size-5 shrink-0 text-foreground" aria-hidden="true" />
                <span className="leading-tight">
                  <span className="block text-[10px] text-muted-foreground">
                    Download on the
                  </span>
                  <span className="block text-sm font-medium text-white">
                    App Store
                  </span>
                </span>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="text-muted-foreground transition-colors hover:text-gray-100"
              >
                <Icon className="size-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <hr className="my-6 border-gray-800" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {year} {company}
          </p>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {links.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}