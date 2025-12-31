"use client";

import { useEffect, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
    />
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
          <div className="h-6 bg-gray-700 rounded" />
          <div className="h-10 bg-gray-700 rounded" />
          <div className="h-10 bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-black px-4">

      {/* Starfield */}
      <Starfield />

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
              className="text-4xl font-bold text-purple-400"
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
        className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2
                   rounded-2xl bg-white/5 backdrop-blur-2xl
                   border border-white/10
                   shadow-[0_0_80px_rgba(168,85,247,0.25)]"
      >

        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-center p-10 text-white">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to <span className="text-purple-400">NAC</span>
          </h1>
          <p className="text-gray-400 max-w-md">
            Discover movies, rate content, and build your watchlist.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col items-center justify-center p-10 bg-black/40 rounded-2xl">
          <h2 className="text-2xl text-white font-semibold mb-2">
            Sign in
          </h2>

          <p className="text-gray-400 text-sm mb-8">
            Continue with Google
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signIn("google")}
            className="w-full max-w-xs px-6 py-3 rounded-lg
                       bg-gradient-to-r from-purple-700 to-pink-600
                       text-white font-semibold shadow-lg"
          >
            Continue with Google
          </motion.button>

          <p className="text-xs text-gray-500 mt-6 text-center">
            Terms & Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
}
