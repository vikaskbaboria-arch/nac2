import { Redis } from '@upstash/redis'
import {Ratelimit} from "@upstash/ratelimit";
const redis = Redis.fromEnv()


const rateLimiter = new  Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(200, "1 m"),
})

export {rateLimiter}