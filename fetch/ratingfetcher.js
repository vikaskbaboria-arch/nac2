
// client-side rating helpers with small in-memory cache and batch API
const clientCache = new Map(); // id -> { value, expires }
const CLIENT_TTL = 60 * 1000; // 60s

export const fetchratings = async (movieId) => {
    if (!movieId) return null;
    const now = Date.now();
    const cached = clientCache.get(movieId);
    if (cached && cached.expires > now) return cached.value;

    const res = await fetch(`/api/review?movieId=${movieId}`);
    const data = await res.json();
    const v = data?.averageRating ?? null;
    clientCache.set(movieId, { value: v, expires: now + CLIENT_TTL });
    return v;
};

export const fetchRatingsBatch = async (ids = []) => {
    const now = Date.now();
    const out = {};
    const need = [];
    for (const id of ids) {
        const n = Number(id);
        if (!n) continue;
        const entry = clientCache.get(n);
        if (entry && entry.expires > now) out[n] = entry.value;
        else need.push(n);
    }
    if (need.length === 0) return out;

    const res = await fetch(`/api/review/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: need }),
    });
    if (!res.ok) {
        // fall back to nulls for requested ids
        for (const id of need) {
            out[id] = null;
        }
        return out;
    }
    const data = await res.json();
    const map = data?.ratings || {};
    for (const id of need) {
        const v = typeof map[id] !== "undefined" ? map[id] : null;
        clientCache.set(id, { value: v, expires: now + CLIENT_TTL });
        out[id] = v;
    }
    return out;
};