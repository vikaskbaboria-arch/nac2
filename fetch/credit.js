const fetchCredit = async (id, media) => {
        const res = await fetch(`/api/tmdb/${media}/${id}/credits`);
        const data = await res.json();
        return data;
};

export { fetchCredit };
