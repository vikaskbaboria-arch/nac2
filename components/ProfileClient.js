"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import WatchListData from "@/components/WatchListData";

const ProfileClient = ({ username }) => {
  const { data: session } = useSession();

  return (
    <div className="px-4 sm:px-8 py-10 min-h-screen text-white">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* LEFT SIDEBAR */}
        <div className="lg:col-span-2 rounded-2xl bg-black/70 backdrop-blur-md p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col items-center text-center">
              <img
                src={session?.user?.image || "/avatar.png"}
                alt="profile"
                className="w-28 h-28 rounded-full border-4 border-purple-800 shadow-lg"
              />

              <h2 className="mt-4 text-xl font-semibold">
                {username}
              </h2>

              <button className="mt-4 px-4 py-2 rounded-lg bg-purple-900 hover:bg-purple-700 transition">
                Edit Profile
              </button>
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3 text-purple-400">
                👤 <span>Profile</span>
              </div>
              <div className="flex items-center gap-3 hover:text-purple-400 cursor-pointer">
                ⭐ <span>Watchlist</span>
              </div>
              <div className="flex items-center gap-3 hover:text-purple-400 cursor-pointer">
                ✍️ <span>Reviews</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 text-red-400 hover:text-red-500"
          >
            ⏻ Log Out
          </button>
        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:col-span-3 rounded-2xl bg-black/60 backdrop-blur-md p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Watchlist</h1>
            <p className="text-sm text-gray-400">
              Your saved movies & TV series
            </p>
          </div>

          {/* WATCHLIST */}
          <WatchListData />
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;
