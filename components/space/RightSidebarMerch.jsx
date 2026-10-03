"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";

export default function RightSidebarMerch() {
  return (
    <aside className="w-72 lg:w-80 shrink-0 hidden lg:block sticky top-24 self-start space-y-5">
      {/* FEATURED WALL DECOR / MERCH CARD (Matches screenshot) */}
      <div className="rounded-3xl bg-[#141418] border border-white/10 p-3.5 shadow-2xl overflow-hidden transition-all duration-300 hover:border-white/20">
        {/* Product Image */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/5 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80"
            alt="Batman 6mm MDF Wood Wall Decor Art"
            className="w-full h-full object-cover filter contrast-125"
            onError={(e) => {
              // fallback stylish graphic if external image fails
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement.classList.add("bg-gradient-to-b", "from-zinc-800", "to-zinc-950");
            }}
          />
          {/* Subtle logo/emblem overlay mimicking the Batman silhouette if needed */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              viewBox="0 0 100 45"
              className="w-44 h-24 fill-black drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] opacity-95"
            >
              <path d="M50 15 C45 8, 43 0, 41 0 C39 0, 37 8, 32 15 C20 10, 5 15, 0 35 C15 32, 25 38, 30 45 C35 38, 42 42, 50 45 C58 42, 65 38, 70 45 C75 38, 85 32, 100 35 C95 15, 80 10, 68 15 C63 8, 61 0, 59 0 C57 0, 55 8, 50 15 Z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm font-semibold text-white mt-3.5 mb-3 leading-snug px-1 line-clamp-1">
          Batman 6mm MDF Wood Wall Decor Art
        </h4>

        {/* Amazon Checkout Button */}
        <a
          href="https://www.amazon.com/dp/B08V53G278?tag=nac-20"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl bg-[#f59e0b] hover:bg-[#eab308] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-amber-950/40 active:scale-98 cursor-pointer"
        >
          {/* Minimalist Amazon 'a' glyph */}
          <span className="font-serif text-sm font-black lowercase">a</span>
          <span>Checkout on Amazon</span>
          <ExternalLink size={13} className="stroke-[2.5]" />
        </a>
      </div>

      {/* CURATED NAC VAULT PICKS */}
      <div className="rounded-3xl bg-[#101013] border border-white/5 p-4 text-xs text-zinc-400">
        <div className="flex items-center gap-1.5 font-bold text-white mb-2 text-xs uppercase tracking-wider">
          <Sparkles size={13} className="text-purple-400" />
          <span>Curator Picks</span>
        </div>
        <p className="leading-relaxed text-[11px] text-zinc-500 mb-3">
          Explore cinema masterworks hand-picked by the NAC community.
        </p>
        <Link
          href="/collection"
          className="block text-center py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition"
        >
          Browse Collection ↗
        </Link>
      </div>
    </aside>
  );
}
