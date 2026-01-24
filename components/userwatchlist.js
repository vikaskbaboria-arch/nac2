"use client";

import React, { useEffect, useState } from "react";
import Watchcomp from "./watchcomp";

const Userwatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/api/watchlist");
      const data = await res.json();
      setWatchlist(data.watchlist || []);
    };
    loadData();
  }, []);
  console.log(watchlist)
  return (
    <div>
      {watchlist.map((item) => (
        <Watchcomp
          key={item._id}              // ✅ UNIQUE KEY
          movieid={item.movie.movieid}
        />
      ))}
    </div>
  );
};

export default Userwatchlist;
