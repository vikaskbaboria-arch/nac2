"use client";

import { useEffect, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fetchMovies } from "@/lib/masterfetch";

/* ================= STARFIELD BACKGROUND ================= */
function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let stars = [];
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        s: Math.random() * 0.3 + 0.1,
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";

      stars.forEach((star) => {
        star.y += star.s;
        if (star.y > canvas.height) star.y = 0;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40" />;
}

/* ================= POSTER COLLAGE (left panel) ================= */
function PosterCollage() {
  const [posters, setPosters] = useState(null);

  useEffect(() => {
    fetchMovies({ type: "trending", time: "day", type_of: "all" })
      .then((m) => {
        const urls = (m?.results || [])
          .filter((r) => r.poster_path)
          .slice(0, 9)
          .map((r) => `https://image.tmdb.org/t/p/w342${r.poster_path}`);
        setPosters(urls);
      })
      .catch(() => setPosters([]));
  }, []);

  return (
    <div className="relative h-48 sm:h-56 md:h-full w-full overflow-hidden">
      {/* Poster grid */}
      <div className="grid h-full grid-cols-3 gap-1.5 sm:gap-2 p-2 sm:p-2.5">
        {(posters ?? Array.from({ length: 9 })).map((src, i) => (
          <div
            key={src ?? i}
            className="relative overflow-hidden rounded-lg bg-white/5 aspect-[2/3] md:aspect-auto"
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                style={{ animationDelay: `${i * 70}ms` }}
              />
            ) : (
              <div className="h-full w-full animate-pulse bg-white/5" />
            )}
          </div>
        ))}
      </div>

      {/* Cinematic gradient overlays for smooth blending */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d0914] via-[#0d0914]/60 to-black/30 md:from-[#0d0914] md:via-black/30 md:to-black/60" />
      <div className="pointer-events-none absolute inset-0 hidden md:block bg-gradient-to-r from-black/20 via-transparent to-[#0d0914]" />

      {/* Copy over the collage */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7 md:p-10 text-white">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-medium w-fit mb-2 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span>Trending Discoveries</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-1.5 md:mb-2 text-white">
          Welcome to <span className="bg-gradient-to-r from-[#9b51e0] via-[#c084fc] to-[#e8a94a] bg-clip-text text-transparent">NAC</span>
        </h1>
        <p className="max-w-md text-xs sm:text-sm md:text-base text-gray-300/90 leading-relaxed">
          Discover movies, rate content, and curate your ultimate watchlist.
        </p>
      </div>
    </div>
  );
}

/* ================= LOGIN PAGE ================= */
export default function Login() {
  const { status } = useSession();
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true);

  /* Redirect if logged in */
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  /* Mobile-only intro */
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 768) {
        setShowIntro(false);
      } else {
        const t = setTimeout(() => setShowIntro(false), 2200);
        return () => clearTimeout(t);
      }
    }
  }, []);

  /* Skeleton Loader */
  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-sm p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4 animate-pulse">
          <div className="w-12 h-12 bg-white/10 rounded-2xl mx-auto" />
          <div className="h-6 w-32 bg-white/10 rounded mx-auto" />
          <div className="h-4 w-48 bg-white/5 rounded mx-auto" />
          <div className="h-12 w-full bg-white/10 rounded-xl mt-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-8 sm:py-12 overflow-hidden">
      {/* Starfield background */}
      <Starfield />

      {/* Atmospheric ambient glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-purple-600/15 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/10 rounded-full blur-[120px]" />

      {/* Mobile Intro */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7d29e4] to-[#e8a94a] p-[1px] shadow-[0_0_35px_rgba(125,41,228,0.6)] flex items-center justify-center">
                <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-black text-white">NAC</span>
                </div>
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#e8a94a] font-semibold">
                Not A Critic
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-5xl
                   min-h-[500px] md:h-[580px] grid grid-cols-1 md:grid-cols-2
                   rounded-2xl sm:rounded-3xl overflow-hidden
                   bg-[#0c0912]/85 backdrop-blur-2xl
                   border border-white/10
                   shadow-[0_0_80px_rgba(125,41,228,0.15),0_0_40px_rgba(232,169,74,0.1)]"
      >
        {/* LEFT PANEL: poster collage */}
        <PosterCollage />

        {/* RIGHT PANEL: sign in */}
        <div className="flex flex-col items-center justify-center p-6 sm:p-10 md:p-12 bg-[#0d0914]/80 backdrop-blur-xl relative">
          {/* Subtle decorative glow */}
          <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />

          {/* Logo / Badge */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7d29e4] to-[#49168f] p-[1px] shadow-[0_0_25px_rgba(125,41,228,0.4)] mb-4 flex items-center justify-center">
            <div className="w-full h-full bg-[#0d0914] rounded-2xl flex items-center justify-center">
              <span className="text-lg font-black tracking-wider text-[#e8a94a]">N</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl text-white font-bold tracking-tight mb-2 text-center">
            Sign in to NAC
          </h2>

          <p className="text-gray-400 text-xs sm:text-sm mb-6 sm:mb-8 text-center max-w-xs">
            Connect your account to save movies, write reviews, and track your watchlist.
          </p>

          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn("google")}
            className="w-full max-w-xs sm:max-w-sm px-6 py-3.5 rounded-xl
                       bg-white hover:bg-neutral-100 text-neutral-900
                       text-sm sm:text-base font-semibold
                       shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_28px_rgba(255,255,255,0.25)]
                       border border-neutral-200
                       flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.4H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1c.9-2.8 3.5-5 6.6-5Z"
              />
            </svg>
            <span>Continue with Google</span>
          </motion.button>

          {/* Feature benefits / trust indicators */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-xs sm:max-w-sm mt-6 pt-6 border-t border-white/10 text-center">
            <div className="flex flex-col items-center">
              <span className="text-[11px] sm:text-xs font-medium text-white/90">Watchlist</span>
              <span className="text-[10px] text-gray-500">Sync anytime</span>
            </div>
            <div className="flex flex-col items-center border-x border-white/10">
              <span className="text-[11px] sm:text-xs font-medium text-white/90">Reviews</span>
              <span className="text-[10px] text-gray-500">Share verdict</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[11px] sm:text-xs font-medium text-white/90">Curations</span>
              <span className="text-[10px] text-gray-500">Find gems</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-6 text-center leading-relaxed">
            By signing in, you agree to our{" "}
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white underline underline-offset-2 transition"
            >
              Terms
            </Link>{" "}
            &amp;{" "}
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white underline underline-offset-2 transition"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
