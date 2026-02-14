# 🚀 Vercel Deployment Guide

Your project is ready for deployment! Follow these steps to deploy your Smart Bookmark Manager to Vercel.

## 📋 Pre-Deployment Checklist

✅ Code pushed to GitHub: https://github.com/AKSHAT-ARORA03/smart_bookmark_manager  
✅ Supabase project created  
✅ Database tables created  
✅ Google OAuth configured  

---

## 🔧 Step-by-Step Deployment

### Step 1: Go to Vercel

1. Visit https://vercel.com
2. Click **"Sign Up"** or **"Log In"**
3. Sign in with your **GitHub account**

### Step 2: Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Find **"smart_bookmark_manager"** in your repositories list
3. Click **"Import"**

### Step 3: Configure Project

1. **Framework Preset**: Should auto-detect as **Next.js** ✅
2. **Root Directory**: Leave as `./` (default)
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `.next` (auto-detected)

### Step 4: Add Environment Variables

**CRITICAL:** Add these environment variables in Vercel:

1. Click **"Environment Variables"**
2. Add the following:

   **Variable 1:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://jevdpmhjgdreohmrqjoy.supabase.co`
   - **Environment**: Check all (Production, Preview, Development)

   **Variable 2:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: `sb_publishable_Ma50zfeZY72K7qPue-nwrg_PHedZHG-`
   - **Environment**: Check all (Production, Preview, Development)

3. Click **"Add"** for each variable

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment to complete ⏳
3. You'll see "Congratulations!" when done 🎉

### Step 6: Copy Your Production URL

After deployment completes:
1. Copy your production URL (e.g., `https://smart-bookmark-manager.vercel.app`)
2. You'll need this for the next steps

---

## 🔄 Update OAuth Settings

After your first deployment, update these settings:

### A. Update Google Cloud Console

1. Go to https://console.cloud.google.com
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click your OAuth 2.0 Client ID
5. **Add Authorized JavaScript origins**:
   ```
   https://your-app.vercel.app
   ```
6. **Add Authorized redirect URIs**:
   ```
   https://your-app.vercel.app/auth/callback
   ```
7. Click **"Save"**

### B. Update Supabase Settings

1. Go to https://supabase.com/dashboard/project/jevdpmhjgdreohmrqjoy
2. Go to **Authentication** → **URL Configuration**
3. **Add Site URL**: 
   ```
   https://your-app.vercel.app
   ```
4. **Add Redirect URLs**:
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/**
   ```
5. Click **"Save"**

---

## ✅ Verify Deployment

1. Open your production URL: `https://your-app.vercel.app`
2. Click **"Sign in with Google"**
3. Authenticate with Google
4. Try adding a bookmark
5. Test real-time sync by opening in another tab
6. Verify delete functionality

---

## 🔧 Custom Domain (Optional)

To add a custom domain:

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your domain (e.g., `bookmarks.yourdomain.com`)
4. Follow DNS configuration instructions
5. Update Google OAuth and Supabase with new domain

---

## 🐛 Troubleshooting

### Issue: "Failed to add bookmark"
**Solution**: Check that database tables are created in Supabase

### Issue: "Unsupported provider"
**Solution**: Ensure Google OAuth is enabled in Supabase Authentication

### Issue: OAuth redirect error
**Solution**: Verify redirect URIs match exactly in Google Console and Supabase

### Issue: Environment variables not loading
**Solution**: 
1. Go to Vercel project settings
2. Check **Environment Variables**
3. Ensure they're set for Production
4. Redeploy the project

---

## 📱 Monitor Your Deployment

### Vercel Dashboard
- **Analytics**: View visitor stats
- **Logs**: Check runtime logs
- **Deployments**: See deployment history

### Supabase Dashboard
- **Database**: View stored bookmarks
- **Auth**: Monitor user logins
- **API Logs**: Track API usage

---

## 🔄 Making Changes

When you update your code:

1. **Make changes locally**
2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. **Vercel auto-deploys** from GitHub
4. Check deployment at https://vercel.com/dashboard

---

## 📊 Project URLs

- **GitHub**: https://github.com/AKSHAT-ARORA03/smart_bookmark_manager
- **Vercel**: https://vercel.com/dashboard
- **Supabase**: https://supabase.com/dashboard/project/jevdpmhjgdreohmrqjoy
- **Production**: (Will be available after deployment)

---

## 🎉 Success!

Your Smart Bookmark Manager is now live and accessible to anyone with the URL!

**Share it with:**
- Friends and family
- On your resume
- In your portfolio
- On social media

---

**Questions?** Check the main [README.md](README.md) for detailed documentation.
