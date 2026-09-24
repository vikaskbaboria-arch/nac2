const fetchPerson = async (id) => {
  if (!id) return null;
  try {
    const res = await fetch(
      `/api/tmdb/person/${id}?append_to_response=combined_credits,images`,
      { next: { revalidate: 60 * 60 } }
    );
    if (!res.ok) {
      console.error("fetchPerson: proxy request failed", res.status, id);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("fetchPerson: fetch error", err);
    return null;
  }
};
 
export { fetchPerson };