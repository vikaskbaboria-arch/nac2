"use client";

import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Userwatchlist from "@/components/userwatchlist";
import {ShowRevonProflie} from "@/components/showrevonprofile";
import MyInterested from "@/components/myinterested";
// TODO: replace with real counts once the API/data is wired up.
const DUMMY_STATS = {
  reviews: 12,
};

const NAV_ITEMS = [
  { key: "watchlist", label: "Watchlist" },
  { key: "reviews", label: "Reviews" },
  { key: "settings", label: "Settings" },
  {key:"interested", label:"Interested"}
];

const ProfileClient = ({ username, stats = DUMMY_STATS }) => {
  const { data: session } = useSession();
  const [active, setActive] = useState("watchlist");

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-4 sm:px-8 py-10">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
          <img
            src={session?.user?.image || "/avatar.png"}
            alt="profile"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-white/15"
          />

          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">
              {username || session?.user?.name || "Guest"}
            </h1>
            {session?.user?.email && (
              <p className="text-white/40 text-sm mt-1">
                {session.user.email}
              </p>
            )}

            <div className="flex items-center gap-4 mt-3">
              <div className="text-sm">
                <span className="font-semibold text-white">{stats.reviews}</span>
                <span className="text-white/50 ml-1">
                  {stats.reviews === 1 ? "Review" : "Reviews"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 sm:self-start">
            <button
              className="
                px-4 py-2 rounded-lg text-sm font-medium
                border border-white/15
                hover:bg-white/5
                transition
              "
            >
              Edit Profile
            </button>
            <button
              onClick={() => signOut()}
              className="
                px-4 py-2 rounded-lg text-sm font-medium
                text-red-400
                border border-red-400/20
                hover:bg-red-500/10
                transition
              "
            >
              Log Out
            </button>
          </div>
        </div>

        {/* NAV TABS */}
        <div className="flex gap-6 mt-8 border-b border-white/10">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`
                pb-3 text-sm font-medium
                border-b-2 -mb-px
                transition-colors
                ${
                  active === item.key
                    ? "border-purple-500 text-white"
                    : "border-transparent text-white/50 hover:text-white/80"
                }
              `}
            >
              {item.label}
              {item.key === "reviews" && (
                <span className="ml-1.5 text-white/40">({stats.reviews})</span>
              )}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="mt-8">
          {active === "watchlist" && <Userwatchlist />}

          {active === "reviews" && (
           <ShowRevonProflie/>
          )}
           {active === "interested" && (
           <MyInterested/>
          )}

          {active === "settings" && (
            <p className="text-white/50 text-sm">Settings coming soon.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;