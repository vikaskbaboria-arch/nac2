"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function About() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] px-4 sm:px-10 py-16 sm:py-20 text-[#F2F0EA]">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center mb-16 sm:mb-24"
      >
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5">
          About <span className="text-[#C9A227]">NAC</span>
        </h1>

        <p className="text-[#9A968C] text-base sm:text-lg leading-relaxed">
          NAC stands for{" "}
          <span className="text-[#F2F0EA] font-medium">Not A Critic</span> —
          because you don't need to be a professional critic to judge a
          movie. If you've watched it, you're a critic now.
        </p>
      </motion.div>

      {/* MAIN CARDS */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* WHAT WE OFFER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="rounded-xl border border-white/8 bg-[#141414] p-6 sm:p-8"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-[#F2F0EA] mb-5">
            What NAC lets you do
          </h2>

          <ul className="space-y-3 text-sm sm:text-base text-[#9A968C]">
            {[
              "Rate movies & TV series",
              "Write honest reviews — good or bad",
              "Discover trending & popular content",
              "Search movies & series instantly",
              "Find your next binge-worthy watch",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 w-1 h-1 rounded-full bg-[#C9A227] flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* WHY NAC */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="rounded-xl border border-white/8 bg-[#141414] p-6 sm:p-8"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-[#F2F0EA] mb-5">
            Why "Not A Critic"?
          </h2>

          <p className="text-sm sm:text-base text-[#9A968C] leading-relaxed">
            NAC is built for everyday viewers. No film school, no complex
            terms — just real people sharing real opinions. Whether you loved
            a movie or hated the ending, NAC gives you a voice.
            <br />
            <br />
            Because sometimes the best reviews come from people who just
            wanted to relax and watch something good.
          </p>
        </motion.div>
      </div>

      {/* FEATURES STRIP */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          {
            title: "Trending movies",
            desc: "See what everyone is watching right now.",
          },
          {
            title: "Real reviews",
            desc: "No paid hype. Just honest opinions.",
          },
          {
            title: "Smart search",
            desc: "Find movies & series in seconds.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-white/8 bg-[#141414] p-5 sm:p-6 hover:border-white/20 transition-colors"
          >
            <h3 className="text-sm sm:text-base font-semibold text-[#F2F0EA] mb-2">
              {item.title}
            </h3>
            <p className="text-[#9A968C] text-sm leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </motion.div>

      {/* FOUNDER SECTION */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto mt-20 sm:mt-28 text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
          Built by a movie lover
        </h2>

        <p className="text-[#9A968C] text-sm sm:text-base leading-relaxed mb-7">
          NAC is built by someone who loves movies, tech, and building things
          people actually enjoy using. Feedback, ideas, and suggestions are
          always welcome.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="mailto:vikaskbaboria@example.com"
            className="px-5 py-2.5 rounded-full bg-[#C9A227] text-[#0A0A0A] text-sm font-semibold hover:bg-[#dab13a] transition-colors"
          >
            Email
          </Link>

          <Link
            href="https://github.com/vikaskbaboria-arch"
            target="_blank"
            className="px-5 py-2.5 rounded-full border border-white/15 text-[#F2F0EA] text-sm font-medium hover:border-white/30 transition-colors"
          >
            GitHub
          </Link>

          <Link
            href="https://linkedin.com/in/your-linkedin"
            target="_blank"
            className="px-5 py-2.5 rounded-full border border-white/15 text-[#F2F0EA] text-sm font-medium hover:border-white/30 transition-colors"
          >
            LinkedIn
          </Link>
        </div>
      </motion.div>

      {/* FINAL LINE */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-xl mx-auto mt-16 sm:mt-20 text-center border-t border-white/8 pt-10"
      >
        <p className="text-[#9A968C] text-base sm:text-lg">
          NAC is still growing — watchlists, recommendations, and more
          features are on the way.
        </p>

        <p className="mt-3 text-[#C9A227] font-medium">
          Not A Critic — but always an opinion.
        </p>
      </motion.div>
    </div>
  );
}