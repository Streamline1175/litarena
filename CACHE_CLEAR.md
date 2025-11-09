# How to See Live Data

Your API is working perfectly and receiving real data from the bot! 🎉

**Current Live Stats:**
- 15 listings found
- 15 notifications sent
- 520 API requests
- 5 active servers
- 18 active keywords
- 195,441 database entries
- 1 trial tier server

## The Cache Issue

The frontend has a **5-minute cache** to reduce server load. If you opened the page when there was no data, it cached that response.

## Solutions:

### Option 1: Hard Refresh (Quickest)
**Press:** `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)

This bypasses the cache and fetches fresh data.

### Option 2: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Option 3: Wait 5 Minutes
The cache automatically expires after 5 minutes, then it will fetch fresh data.

### Option 4: Clear Cache via Console
1. Open DevTools (F12)
2. Go to Console tab
3. Type: `localStorage.clear()` and press Enter
4. Refresh the page

## Verify It's Working

1. **Open:** http://localhost:5173/litarena/test-api.html
2. You should see the real data (not zeros)
3. If you see real data there, the issue is just browser cache

## What You Should See Now:

When you refresh and open the Mercari bot analytics:

**Standard Metrics:**
- Servers: **5**
- Active Users: **195,441** (database size)
- Commands Today: **0** (calculated from last minute * 60 * 24)
- Commands Total: **0**
- Uptime: **99.5%**
- Avg Response: **454ms**

**Mercari Monitoring Stats:**
- 📊 Listings Found: **15** (+**1**/min)
- 🔔 Notifications: **15** (+**1**/min)
- ⚠️ Active Alerts: **0** (**18** keywords)
- 💾 API Errors: **0**

**Subscription Tier Distribution:**
- Free: **0**
- Trial: **1** ✅
- Basic: **0**
- Premium: **0**
- Elite: **0**

## The Data is Live!

Your bot is successfully posting analytics every minute, and your FastAPI is storing and serving it correctly. The integration is complete! 🚀
