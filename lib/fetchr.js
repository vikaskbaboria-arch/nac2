export const submitReview = async ({mid,rt,rat}) => {
  const res = await fetch("/api/review", {
    method: "POST",
    // ensure cookies (session) are sent
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      movieId: mid,
      reviewText: rt,
      rating: rat
    })
  });

  const data = await res.json();
  console.log(data);
  return data;
};
