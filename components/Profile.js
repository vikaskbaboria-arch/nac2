"use client";
import React from "react";
import { notFound } from "next/navigation";
import { signOut, useSession } from 'next-auth/react'
const Profile = (d) => {
  const { data: session, status } = useSession();
const u =d

if (status === "loading") {
  return null; // or loading UI
}

if (!session) {
  return <div>Please login</div>;
}
console.log(u)
  // if (session.user.name !== username) {
  //   return <div>Page not found</div>;
  // }

  return (
    <div className="px-8 py-10 min-h-screen  text-white">
      
      {/* MAIN GRID */}
      <div className="grid grid-cols-5 gap-6">

        {/* LEFT SIDEBAR */}
        <div className="col-span-2 h-[85vh] rounded-2xl bg-black/70 backdrop-blur-md p-6 flex flex-col justify-between">

          {/* USER INFO */}
          <div>
            <div className="flex flex-col items-center text-center">
              <img
                // src={`${session.user.image || "pic "}`}
                alt="profile"
                className="w-28 h-28 rounded-full border-4 border-purple-800 shadow-lg"
              />
              <h2 className="mt-4 text-xl font-semibold">
                {d}
                </h2>
              

              <button className="mt-4 px-4 py-2 rounded-lg bg-purple-900 hover:bg-purple-700 transition">
                Edit Profile
              </button>
            </div>

            {/* NAV */}
            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3 cursor-pointer text-purple-400">
                👤 <span>Profile</span>
              </div>
              <div className="flex items-center gap-3 cursor-pointer hover:text-purple-400">
                ⭐ <span>Watchlist</span>
              </div>
              <div className="flex items-center gap-3 cursor-pointer hover:text-purple-400">
                ✍️ <span>Reviews</span>
              </div>
            </div>
          </div>

          {/* LOGOUT */}
          <button onClick={()=>signOut()} className="flex items-center gap-2 text-red-400 hover:text-red-500">
            ⏻ Log Out
          </button>
        </div>

        {/* RIGHT CONTENT */}
        <div className="col-span-3 h-[85vh] rounded-2xl bg-black/60 backdrop-blur-md p-6 overflow-y-auto">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Watchlist</h1>
              <p className="text-sm text-gray-400">
                Your saved movies & TV series
              </p>
            </div>

            <input
              type="text"
              placeholder="Search watchlist..."
              className="px-4 py-2 rounded-lg bg-black/60 border border-purple-900 focus:outline-none"
            />
          </div>

          {/* WATCHLIST GRID */}
          
        </div>
      </div>
    </div>
  );
};

export default Profile;
