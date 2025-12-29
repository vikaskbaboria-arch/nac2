"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/profile");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-950 px-6">

      {/* MAIN CARD */}
      <div className="w-full max-w-5xl h-[520px] bg-black/50 backdrop-blur-xl rounded-2xl grid grid-cols-2 overflow-hidden shadow-2xl">

        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-center p-10 text-white">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to <span className="text-purple-400">NAC</span>
          </h1>
          <p className="text-gray-400 leading-relaxed">
            Discover movies & TV series, rate them, write reviews,
            and build your personal watchlist — all in one place.
          </p>

          <div className="mt-8 space-y-3 text-sm text-gray-300">
            <p>⭐ Rate & review content</p>
            <p>🎬 Watch trailers instantly</p>
            <p>📺 Movies + TV series support</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col justify-center items-center bg-black/70 px-10">

          <h2 className="text-2xl font-semibold text-white mb-2">
            Sign in to your account
          </h2>

          <p className="text-gray-400 mb-8 text-sm text-center">
            Use your Google account to continue
          </p>

          {/* GOOGLE BUTTON */}
          <div className="relative inline-flex group w-full max-w-xs">
            <div className="absolute transition-all duration-700 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg group-hover:opacity-100 group-hover:-inset-1"></div>

            <button
              onClick={() => signIn("google")}
              className="relative w-full inline-flex items-center justify-center gap-3 px-6 py-3 rounded-lg text-lg font-semibold text-white bg-purple-900 hover:bg-purple-800 transition focus:outline-none"
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.3 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.2l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.3 19 12 24 12c3.1 0 5.9 1.2 8 3.2l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.6 0-14.1 4.3-17.7 10.7z"/>
                <path fill="#4CAF50" d="M24 44c5.1 0 9.8-1.9 13.3-5l-6.1-5.2c-2 1.5-4.6 2.4-7.2 2.4-5.1 0-9.4-3.4-10.9-8l-6.6 5.1C9.9 39.7 16.4 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.7-6.1 7.5l6.1 5.2c-.4.4 6.7-4.7 6.7-16.7z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-6 text-center">
            By continuing, you agree to our Terms & Privacy Policy
          </p>

        </div>
      </div>
    </div>
  );
}
