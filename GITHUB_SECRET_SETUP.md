# GitHub Secret Setup for API URL

## The Issue

Your GitHub Pages site is using the default API URL (`https://your-api-domain.com/api`) instead of your ngrok URL because environment variables need to be set as GitHub Secrets for the build process.

## Solution: Add GitHub Secret

### Step 1: Go to Repository Settings

1. Go to your GitHub repository: https://github.com/Streamline1175/litarena
2. Click **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**

### Step 2: Add New Repository Secret

1. Click **"New repository secret"** button
2. Fill in:
   - **Name:** `VITE_API_BASE_URL`
   - **Secret:** `https://vast-dynamic-muskrat.ngrok-free.app`
3. Click **"Add secret"**

### Step 3: Trigger New Deployment

Once the secret is added:

```bash
# Commit and push the workflow changes
git add .github/workflows/deploy.yml
git commit -m "Add API URL environment variable to GitHub Actions"
git push
```

This will trigger a new deployment with the correct API URL.

## Important: ngrok URL Changes

⚠️ **Your ngrok URL changes every time you restart ngrok** (unless you have a paid plan with a fixed domain).

### When ngrok URL Changes:

1. Update the GitHub Secret:
   - Go to Settings → Secrets and variables → Actions
   - Click on `VITE_API_BASE_URL`
   - Click "Update secret"
   - Enter the new ngrok URL
   - Save

2. Trigger new deployment:
   - Make any small change to your code
   - Commit and push
   - Or go to Actions tab → Re-run workflow

### Better Solution for Production:

Instead of ngrok, consider:

1. **Deploy FastAPI to a cloud service** with a stable URL:
   - Railway.app (free tier)
   - Fly.io (free tier)
   - Render.com (free tier)
   - Heroku (paid)
   - AWS/GCP/Azure

2. **Use ngrok's paid plan** for a fixed subdomain:
   - `https://your-subdomain.ngrok.io`
   - Never changes
   - Set once in GitHub Secrets

## For Local Development

Local development already works because `.env.local` is configured. The URL in that file will be used automatically when you run `npm run dev`.

**Local:** Uses `.env.local` → `https://vast-dynamic-muskrat.ngrok-free.app`

**GitHub Pages:** Uses GitHub Secret → `VITE_API_BASE_URL`

## Verification

After setting up the secret and deploying:

1. Visit your GitHub Pages site: https://streamline1175.github.io/litarena/
2. Open Mercari Japan Bot → Analytics tab
3. Open DevTools Console (F12)
4. Look for: `[Mercari] Using REAL data from API - Active Servers: 5`
5. Check Network tab - requests should go to your ngrok URL

## Current Status

- ✅ Workflow updated to use environment variable
- ⏳ **You need to:** Add the GitHub Secret `VITE_API_BASE_URL`
- ⏳ **Then:** Push changes to trigger new deployment

Once the secret is added and you push, your GitHub Pages site will connect to your API!
