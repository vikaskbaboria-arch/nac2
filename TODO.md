# TODO: Fix MongoDB Connection Performance Issue

## Tasks
- [ ] Modify db/index.js to implement connection caching (check if already connected)
- [ ] Remove connectDB() calls from app/api/watchlist/route.js (POST and GET)
- [ ] Remove connectDB() calls from app/api/review/route.js (POST and GET)
- [ ] Remove connectDB() calls from app/api/review/batch/route.js (POST)
- [ ] Remove connectDB() calls from app/api/auth/[...nextauth]/options.js (signIn and session callbacks)
- [ ] Test that database operations still work after changes
- [ ] Ensure connection is established at app startup if needed
