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

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />;
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
    <div className="relative w-full h-[360px] sm:h-[440px] md:h-full md:min-h-[calc(100vh-6rem)] overflow-hidden flex flex-col justify-end">
      {/* Poster grid spanning full area - seamless with no space between movies */}
      <div className="absolute inset-0 grid grid-cols-3 gap-0 p-0">
        {(posters ?? Array.from({ length: 9 })).map((src, i) => (
          <div
            key={src ?? i}
            className="relative overflow-hidden bg-white/5 h-full w-full"
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                style={{ animationDelay: `${i * 70}ms` }}
              />
            ) : (
              <div className="h-full w-full animate-pulse bg-white/5" />
            )}
          </div>
        ))}
      </div>

      {/* Gentle gradient so text is readable while keeping the posters bright and clear */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#060000] via-[#060000]/60 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-32 hidden md:block bg-gradient-to-r from-transparent to-[#060000]" />

      {/* Copy over the collage */}
      <div className="relative z-10 p-6 sm:p-10 md:p-12 lg:p-16 text-white max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-400/40 text-purple-200 text-xs font-medium w-fit mb-3 backdrop-blur-md shadow-md">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span>Trending Discoveries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2 md:mb-3 text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-[#9b51e0] via-[#c084fc] to-[#e8a94a] bg-clip-text text-transparent">
            NAC
          </span>
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed max-w-md drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
          Discover movies, rate content, and curate your ultimate personal watchlist.
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
      <div className="min-h-[calc(100vh-6rem)] w-full flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4 animate-pulse text-center">
          <div className="w-14 h-14 bg-white/10 rounded-2xl mx-auto mb-4" />
          <div className="h-7 w-40 bg-white/10 rounded mx-auto" />
          <div className="h-4 w-56 bg-white/5 rounded mx-auto" />
          <div className="h-12 w-full bg-white/10 rounded-xl mt-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-6rem)] w-full flex flex-col md:flex-row items-stretch overflow-hidden">
      {/* Starfield background */}
      <Starfield />

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

      {/* Left Panel: Full-bleed poster collage */}
      <div className="w-full md:w-1/2 lg:w-7/12 relative flex">
        <PosterCollage />
      </div>

      {/* Right Panel: Full-height Sign-in area (no box) */}
      <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col items-center justify-center p-6 sm:p-10 md:p-12 lg:p-16 relative z-10">
        {/* Ambient atmospheric glow */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-purple-600/15 rounded-full blur-[130px]" />
        <div className="pointer-events-none absolute bottom-12 right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-[110px]" />

        <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center relative z-10">
          {/* Logo / Emblem */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7d29e4] to-[#49168f] p-[1px] shadow-[0_0_30px_rgba(125,41,228,0.4)] mb-4 flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0710] rounded-2xl flex items-center justify-center">
              <span className="text-xl font-black tracking-wider text-[#e8a94a]">N</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white font-bold tracking-tight mb-2 text-center">
            Sign in to NAC
          </h2>

          <p className="text-gray-400 text-xs sm:text-sm mb-8 text-center max-w-xs leading-relaxed">
            Connect your account to save movies, write reviews, and track your watchlist.
          </p>

          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn("google")}
            className="w-full px-6 py-3.5 sm:py-4 rounded-xl
                       bg-white hover:bg-neutral-100 text-neutral-900
                       text-sm sm:text-base font-semibold
                       shadow-[0_4px_25px_rgba(255,255,255,0.18)] hover:shadow-[0_6px_35px_rgba(255,255,255,0.28)]
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
          <div className="grid grid-cols-3 gap-2 w-full mt-8 pt-8 border-t border-white/10 text-center">
            <div className="flex flex-col items-center">
              <span className="text-xs sm:text-sm font-medium text-white/90">Watchlist</span>
              <span className="text-[10px] sm:text-xs text-gray-500">Sync anytime</span>
            </div>
            <div className="flex flex-col items-center border-x border-white/10">
              <span className="text-xs sm:text-sm font-medium text-white/90">Reviews</span>
              <span className="text-[10px] sm:text-xs text-gray-500">Share verdict</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs sm:text-sm font-medium text-white/90">Curations</span>
              <span className="text-[10px] sm:text-xs text-gray-500">Find gems</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-8 text-center leading-relaxed">
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
      </div>
    </div>
  );
}
