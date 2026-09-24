"use client";

import { useEffect, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
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
    <div className="relative  h-full w-full overflow-hidden md:block">
      {/* Poster grid */}
      <div className="grid h-full grid-cols-3 gap-1 p-1">
        {(posters ?? Array.from({ length: 9 })).map((src, i) => (
          <div
            key={src ?? i}
            className="relative overflow-hidden rounded-md bg-white/5"
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

      {/* Blend into the card: dark on the edges, clearest in the middle */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/80" />

      {/* Copy over the collage */}
      <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
        <h1 className="text-4xl font-bold mb-3">
          Welcome to <span className="text-[#7d29e4]">NAC</span>
        </h1>
        <p className="max-w-md text-gray-300">
          Discover movies, rate content, and build your watchlist.
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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-72 space-y-4 animate-pulse">
          <div className="h-6 bg-white/10 rounded" />
          <div className="h-10 bg-white/10 rounded" />
          <div className="h-10 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mt-12 overflow-hidden flex items-center justify-center  px-4">

   
      {/* Mobile Intro */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black"
          >
            <motion.h1
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold text-[#e8a94a]"
            >
              NAC
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-5xl h-[560px] grid grid-cols-1 md:grid-cols-2
                   rounded-2xl overflow-hidden bg-white/5 backdrop-blur-2xl
                   border border-white/10
                   shadow-[0_0_80px_rgba(232,169,74,0.18)]"
      >

        {/* LEFT PANEL: poster collage */}
        <PosterCollage />

        {/* RIGHT PANEL: sign in */}
        <div className="flex flex-col items-center justify-center p-10 bg-black/40">
          <h2 className="text-2xl text-white font-semibold mb-2">
            Sign in
          </h2>

          <p className="text-gray-400 text-sm mb-8">
            Continue with Google
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => signIn("google")}
            className="w-full max-w-xs px-6 py-3 rounded-lg
                       green-500 bg-gradient-to-r from-[#005df3] to-[#000000]
                       text-white text-sm sm:text-base
                       font-semibold shadow-lg
                       flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
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
            Continue with Google
          </motion.button>

          <p className="text-xs text-gray-500 mt-6 text-center">
            Terms &amp; Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
}