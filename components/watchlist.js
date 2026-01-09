"use client";

import React, { useState } from "react";

const Watchlist = ({ movieId }) => {
  const [watchlist, setWatchlist] = useState("add to watch");

  const handleSubmit = async () => {
    const response = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movieid:movieId }),
    });

    if (!response.ok) {
      console.error("Not able to add");
      return;
    }

    setWatchlist("already");
  };

  return (
    <div className="bg-green-500">
      <button onClick={handleSubmit}>{watchlist}</button>
    </div>
  );
};

export default Watchlist;
