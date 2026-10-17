import redis from "./redis.js";


export async function getOrsetCache(key,ttlSeconds,fetchData) {
    try {
        const cached = await  redis.get(key);
        if(cached!==null){
            return cached;
        }
    } catch (error) {
          console.error("Redis read failed:", error.message);
    }
     const data = await fetchData();

  if (data == null) {
    return data;
  }

  // Save successful results
  try {
    await redis.set(key, data, {
      ex: ttlSeconds,
    });
  } catch (error) {
    console.error("Redis write failed:", error.message);
  }

  return data;
}