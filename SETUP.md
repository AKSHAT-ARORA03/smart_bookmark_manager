# Smart Bookmark Manager - Setup Guide

## 🚀 Quick Start

Follow these steps to get the application running locally:

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings:
1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings → API
4. Copy the "Project URL" and "anon/public" key

### 3. Set Up Supabase Database

Run the following SQL in your Supabase SQL Editor (Settings → SQL Editor):

```sql
-- Create bookmarks table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Create policies
create policy "Users can insert their own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can update their own bookmarks"
  on bookmarks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);

-- Enable Realtime
alter publication supabase_realtime add table bookmarks;
```

### 4. Configure Google OAuth

#### In Google Cloud Console:
1. Go to https://console.cloud.google.com
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://[your-project-ref].supabase.co/auth/v1/callback`
6. Add authorized JavaScript origins: `http://localhost:3000`

#### In Supabase:
1. Go to Authentication → Providers
2. Enable Google provider
3. Add your Google Client ID and Client Secret
4. Save changes

### 5. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 📦 Project Structure

```
smart-bookmark-app/
├── app/                        # Next.js App Router
│   ├── auth/
│   │   ├── callback/          # OAuth callback handler
│   │   └── auth-code-error/   # Error page
│   ├── dashboard/             # Main dashboard
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global styles
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── AuthButton.tsx
│   ├── BookmarkCard.tsx
│   ├── BookmarkForm.tsx
│   ├── BookmarkList.tsx
│   └── Navbar.tsx
├── lib/
│   ├── supabase/              # Supabase clients
│   └── utils.ts               # Helper functions
├── types/                     # TypeScript definitions
└── middleware.ts              # Auth middleware
```

## 🔧 Common Issues

### Issue: "Invalid redirect URI"
**Solution**: Make sure the redirect URI in Google Cloud Console exactly matches the Supabase callback URL.

### Issue: Bookmarks not appearing
**Solution**: Check that Row Level Security policies are properly configured in Supabase.

### Issue: Real-time updates not working
**Solution**: Ensure Realtime is enabled on the bookmarks table.

## 📝 Next Steps

1. Test the application locally
2. Deploy to Vercel
3. Update OAuth settings with production URL
4. Add production environment variables in Vercel

For detailed deployment instructions, see the main README.md file.
