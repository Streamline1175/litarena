# FastAPI Setup for Mercari Analytics GET Endpoint

## Current Situation

Your FastAPI currently has:
- ✅ POST `/analytics/mercari` - Bot posts analytics data here
- ❌ GET `/analytics/mercari` - **NEEDED** for frontend to fetch data

## Solution

You need to add a GET endpoint that returns the latest analytics snapshot that was posted by your bot.

## Implementation Options

### Option 1: Store in Memory (Quick & Simple)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
from datetime import datetime

app = FastAPI()

# Enable CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://streamline1175.github.io",  # Your GitHub Pages domain
        "http://localhost:5173",              # Local development
        "http://localhost:4173",              # Local preview
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store latest analytics in memory
latest_analytics: Dict[str, Any] = None

@app.post("/analytics/mercari")
async def receive_mercari_analytics(analytics_data: dict):
    """
    Receive analytics data from the bot (existing endpoint)
    """
    global latest_analytics
    latest_analytics = analytics_data
    latest_analytics["last_updated"] = datetime.utcnow().isoformat()

    return {
        "status": "success",
        "message": "Analytics received",
        "timestamp": latest_analytics["last_updated"]
    }

@app.get("/analytics/mercari")
async def get_mercari_analytics():
    """
    Return latest analytics snapshot for frontend (NEW ENDPOINT)
    """
    if latest_analytics is None:
        return {
            "error": "No analytics data available yet",
            "message": "Waiting for first analytics post from bot"
        }

    return latest_analytics
```

### Option 2: Store in Database (Production-Ready)

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, JSON, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime

app = FastAPI()

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./analytics.db"  # or PostgreSQL
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class MercariAnalytics(Base):
    __tablename__ = "mercari_analytics"

    id = Column(Integer, primary_key=True, index=True)
    bot_name = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    analytics_data = Column(JSON)

Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://streamline1175.github.io",
        "http://localhost:5173",
        "http://localhost:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analytics/mercari")
async def receive_mercari_analytics(analytics_data: dict):
    """Store analytics in database"""
    db = SessionLocal()
    try:
        analytics_entry = MercariAnalytics(
            bot_name=analytics_data.get("bot_name", "mercarijp_bot"),
            analytics_data=analytics_data
        )
        db.add(analytics_entry)
        db.commit()

        return {"status": "success", "message": "Analytics stored"}
    finally:
        db.close()

@app.get("/analytics/mercari")
async def get_mercari_analytics():
    """Get latest analytics from database"""
    db = SessionLocal()
    try:
        latest = db.query(MercariAnalytics).order_by(
            MercariAnalytics.timestamp.desc()
        ).first()

        if not latest:
            raise HTTPException(
                status_code=404,
                detail="No analytics data available"
            )

        return latest.analytics_data
    finally:
        db.close()
```

### Option 3: Use Redis (Fast & Scalable)

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import redis
import json

app = FastAPI()

# Redis connection
redis_client = redis.Redis(host='localhost', port=6379, db=0)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://streamline1175.github.io",
        "http://localhost:5173",
        "http://localhost:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analytics/mercari")
async def receive_mercari_analytics(analytics_data: dict):
    """Store analytics in Redis"""
    redis_client.set(
        "mercari:latest_analytics",
        json.dumps(analytics_data),
        ex=3600  # Expire after 1 hour
    )
    return {"status": "success", "message": "Analytics cached"}

@app.get("/analytics/mercari")
async def get_mercari_analytics():
    """Get latest analytics from Redis"""
    data = redis_client.get("mercari:latest_analytics")

    if not data:
        raise HTTPException(
            status_code=404,
            detail="No analytics data available"
        )

    return json.loads(data)
```

## Recommended Approach

**For Development/Testing:** Use **Option 1** (In-Memory)
- Simplest to implement
- No database setup needed
- Perfect for testing with ngrok

**For Production:** Use **Option 2** (Database) or **Option 3** (Redis)
- Persistent storage
- Survives server restarts
- Can query historical data

## Testing Your Implementation

Once you've added the GET endpoint, test it:

```bash
# Test the GET endpoint
curl https://vast-dynamic-muskrat.ngrok-free.app/analytics/mercari

# Should return analytics JSON if bot has posted data
```

## Important Notes

1. **CORS Configuration:**
   - Add your GitHub Pages domain: `https://streamline1175.github.io`
   - Include localhost for testing

2. **ngrok Considerations:**
   - Your ngrok URL changes each time unless you have a paid plan
   - Update `.env.local` with new URL when ngrok restarts
   - Consider getting a stable ngrok domain for production

3. **Data Freshness:**
   - Bot posts analytics every minute
   - Frontend caches for 5 minutes
   - GET endpoint should return most recent data

## Next Steps

1. Choose an implementation option above
2. Add the GET endpoint to your FastAPI
3. Restart your FastAPI server
4. Test the endpoint with curl
5. Your frontend will automatically fetch data when you open the Mercari bot modal

## Frontend Status

Your frontend is already configured and ready:
- ✅ `.env.local` points to your ngrok URL
- ✅ API service will call GET `/analytics/mercari`
- ✅ BotAnalytics component displays Mercari-specific data
- ✅ Automatic fallback to mock data if API unavailable
