---
description: How to deploy the Next.js application to Vercel
---

# Vercel Deployment Guide

This guide explains how to deploy the RoomShare application to Vercel and configure the necessary environment variables.

## 1. Push to GitHub
Ensure all your local changes are committed and pushed to your GitHub repository.

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## 2. Import Project in Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** button and select **"Project"**.
3. Find your GitHub repository in the list and click **"Import"**.

## 3. Configure Environment Variables (Critical)
Before clicking "Deploy", you must add the Environment Variables. These connect your Vercel app to your Firebase database.

1. In the "Configure Project" screen, expand the **"Environment Variables"** section.
2. Open your local `.env.local` file.
3. Copy the value for each key and add them one by one in Vercel:

| Key | Description |
|-----|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID |

**Tip:** You can often copy the entire content of `.env.local` and paste it into the "Key" field in Vercel's Environment Variables UI—Vercel is smart enough to parse correct key-value pairs automatically!

## 4. Deploy
1. Click **"Deploy"**.
2. Wait for the build to complete.
3. Once finished, you will get a public URL (e.g., `https://next-room-share.vercel.app`).

## Troubleshooting
- **Database Error?** If the app loads but data doesn't show, you likely missed an environment variable. Go to **Settings > Environment Variables** in Vercel project settings, add missing keys, and then **Redeploy** (Deployments > Redeploy).
