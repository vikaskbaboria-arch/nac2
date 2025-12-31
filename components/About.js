"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function About() {
  return (
    <div className="relative min-h-screen px-4 sm:px-10 py-16 sm:py-20 text-white">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto text-center mb-14 sm:mb-20"
      >
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">
          About <span className="text-purple-400">NAC</span>
        </h1>

        <p className="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto">
          NAC stands for{" "}
          <span className="text-purple-300 font-semibold">Not A Critic</span> —
          because you don’t need to be a professional critic to judge a movie.
          If you’ve watched it, congratulations… you’re a critic now 😄
        </p>
      </motion.div>

      {/* MAIN CARDS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">

        {/* WHAT WE OFFER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative p-[1.5px] rounded-2xl
          bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-600"
        >
          <div className="rounded-2xl bg-black/80 backdrop-blur-xl p-6 sm:p-8 h-full">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              🎬 What NAC Lets You Do
            </h2>

            <ul className="space-y-3 text-gray-300 text-sm sm:text-base">
              <li>⭐ Rate movies & TV series</li>
              <li>📝 Write honest reviews (good or bad)</li>
              <li>🔥 Discover trending & popular content</li>
              <li>🔍 Search movies & series instantly</li>
              <li>📺 Find your next binge-worthy watch</li>
            </ul>
          </div>
        </motion.div>

        {/* WHY NAC */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative p-[1.5px] rounded-2xl
          bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-600"
        >
          <div className="rounded-2xl bg-black/80 backdrop-blur-xl p-6 sm:p-8 h-full">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              💜 Why “Not A Critic”?
            </h2>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              NAC is built for everyday viewers.
              No film school. No complex terms.
              Just real people sharing real opinions.
              Whether you loved a movie or hated the ending —
              NAC gives you a voice.
              <br /><br />
              Because sometimes the best reviews come from people
              who just wanted to relax and watch something good.
            </p>
          </div>
        </motion.div>
      </div>

      {/* FEATURES STRIP */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto mt-16 sm:mt-24
        grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
      >
        {[
          {
            title: "Trending Movies",
            desc: "See what everyone is watching right now.",
          },
          {
            title: "Real Reviews",
            desc: "No paid hype. Just honest opinions.",
          },
          {
            title: "Smart Search",
            desc: "Find movies & series in seconds.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white/5 backdrop-blur-xl rounded-xl p-5 sm:p-6
            border border-white/10 hover:border-purple-500/50 transition"
          >
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-purple-300">
              {item.title}
            </h3>
            <p className="text-gray-400 text-sm">
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
        className="max-w-4xl mx-auto mt-20 sm:mt-28 text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          👨‍💻 Built by a Movie Lover
        </h2>

        <p className="text-gray-400 text-sm sm:text-base mb-6">
          NAC is built by someone who loves movies, tech, and building
          things people actually enjoy using.
          Feedback, ideas, and suggestions are always welcome.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="mailto:your-email@example.com"
            className="px-4 py-2 rounded-md
            bg-purple-700 hover:bg-purple-600 transition text-sm"
          >
            📧 Email
          </Link>

          <Link
            href="https://github.com/your-github"
            target="_blank"
            className="px-4 py-2 rounded-md
            bg-white/10 hover:bg-white/20 transition text-sm"
          >
            💻 GitHub
          </Link>

          <Link
            href="https://linkedin.com/in/your-linkedin"
            target="_blank"
            className="px-4 py-2 rounded-md
            bg-white/10 hover:bg-white/20 transition text-sm"
          >
            🔗 LinkedIn
          </Link>
        </div>
      </motion.div>

      {/* FINAL LINE */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto mt-16 sm:mt-24 text-center"
      >
        <p className="text-gray-400 text-base sm:text-lg">
          NAC is still growing — watchlists, recommendations,
          and more features are on the way.
        </p>

        <p className="mt-3 text-purple-400 font-semibold">
          🎥 Not A Critic — but always an opinion.
        </p>
      </motion.div>

    </div>
  );
}
