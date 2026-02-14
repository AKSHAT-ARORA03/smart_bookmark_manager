# 🔖 Smart Bookmark Manager

A modern, real-time bookmark management application with Google OAuth authentication, built with Next.js and Supabase.

## 🌐 Live Demo

**Live Application**: [https://smart-bookmark-manager-chi.vercel.app/](https://smart-bookmark-manager-chi.vercel.app/)

**GitHub Repository**: [https://github.com/AKSHAT-ARORA03/smart-bookmark-app](https://github.com/AKSHAT-ARORA03/smart-bookmark-app)

---

## ✨ Features

- 🔐 **Google OAuth Authentication** - Secure login with Google (no email/password required)
- 📌 **Add Bookmarks** - Save URLs with custom titles quickly and easily
- 🔒 **Private Bookmarks** - Each user's bookmarks are completely private and secure
- ⚡ **Real-time Synchronization** - Changes appear instantly across all open tabs
- 🗑️ **Delete Bookmarks** - Remove bookmarks with confirmation dialog
- 📱 **Fully Responsive** - Beautiful UI on desktop, tablet, and mobile
- 🎨 **Modern Design** - Professional interface with smooth animations
- ♿ **Accessible** - Keyboard navigation and screen reader support

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router)
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase PostgreSQL
- **Real-time**: Supabase Realtime subscriptions
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Google Cloud Console account
- Supabase account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AKSHAT-ARORA03/smart-bookmark-app.git
   cd smart-bookmark-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔧 Configuration

### Supabase Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Create the bookmarks table**
   
   Run this SQL in the Supabase SQL Editor:
   ```sql
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

3. **Enable Google OAuth**
   - Go to Authentication → Providers in Supabase Dashboard
   - Enable Google provider
   - Add your Google OAuth credentials (see next section)

4. **Configure Site URL and Redirect URLs**
   - Go to Authentication → URL Configuration
   - Add Site URL: `http://localhost:3000` (development) and `https://your-app.vercel.app` (production)
   - Add Redirect URLs: 
     - `http://localhost:3000/auth/callback`
     - `https://your-app.vercel.app/auth/callback`

### Google Cloud Console Setup

1. **Create a new project** at [console.cloud.google.com](https://console.cloud.google.com)

2. **Enable Google+ API**
   - Go to APIs & Services → Library
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 credentials**
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"

4. **Configure OAuth consent screen**
   - Add app name, user support email, and developer contact

5. **Add Authorized JavaScript origins**
   ```
   http://localhost:3000
   https://your-app.vercel.app
   ```

6. **Add Authorized redirect URIs**
   ```
   http://localhost:3000/auth/callback
   https://your-app.vercel.app/auth/callback
   ```

7. **Copy credentials**
   - Copy Client ID and Client Secret
   - Add them to Supabase Google provider settings

### Vercel Deployment

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Add environment variables**
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your production URL

5. **Update OAuth settings**
   - Add production URL to Google Cloud Console authorized origins and redirects
   - Add production URL to Supabase redirect URLs

---

## 📁 Project Structure

```
smart-bookmark-app/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Landing/login page
│   ├── dashboard/
│   │   ├── page.tsx            # Main bookmark dashboard
│   │   └── loading.tsx         # Loading state
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts        # OAuth callback handler
│   └── globals.css             # Global styles and Tailwind
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── Toast.tsx
│   ├── BookmarkForm.tsx        # Form to add bookmarks
│   ├── BookmarkList.tsx        # List/grid of bookmarks
│   ├── BookmarkCard.tsx        # Individual bookmark card
│   ├── Navbar.tsx              # Navigation bar
│   └── AuthButton.tsx          # Google sign-in button
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   ├── server.ts           # Server Supabase client
│   │   └── middleware.ts       # Auth middleware
│   └── utils.ts                # Helper functions
├── types/
│   └── index.ts                # TypeScript interfaces
├── public/                     # Static assets
├── .env.local                  # Environment variables (not in repo)
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🏗️ Architecture

### Database Schema

**bookmarks table**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `title` (text)
- `url` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Security

- **Row Level Security (RLS)**: Enabled on bookmarks table
- **Authentication**: Google OAuth via Supabase Auth
- **Authorization**: Users can only access their own bookmarks
- **Data Privacy**: All queries filtered by authenticated user ID

### Real-time Synchronization

The application uses Supabase Realtime to subscribe to database changes:
- Listens for INSERT events when bookmarks are added
- Listens for DELETE events when bookmarks are removed
- Automatically updates UI across all open tabs
- Filters events by current user's ID for privacy

---

## 🐛 Problems Encountered & Solutions

### Problem 1: OAuth Redirect URI Mismatch

**Challenge**: When implementing Google OAuth, I encountered a "redirect_uri_mismatch" error that prevented users from logging in.

**Root Cause**: The redirect URIs configured in Google Cloud Console didn't exactly match the callback URL used by Supabase Auth.

**Solution**: 
- Carefully verified the exact callback URL format: `https://[project-ref].supabase.co/auth/v1/callback`
- Added both development (`http://localhost:3000/auth/callback`) and production URLs to Google Cloud Console
- Ensured URLs matched exactly, including the protocol (http vs https) and trailing slashes
- Updated Supabase Auth settings to include all valid redirect URLs

**Learning**: OAuth configuration requires exact URL matching. Always double-check both the identity provider and the auth service settings.

---

### Problem 2: Row Level Security Blocking Queries

**Challenge**: After setting up the database, bookmarks weren't appearing in the UI even though they existed in the database.

**Root Cause**: Row Level Security (RLS) was enabled but policies weren't correctly configured to use the authenticated user's ID.

**Solution**:
- Used `auth.uid()` function in RLS policies instead of trying to pass user_id from the client
- Created separate policies for SELECT, INSERT, UPDATE, and DELETE operations
- Tested policies directly in Supabase SQL editor with different user contexts
- Verified that `auth.uid()` correctly returned the logged-in user's ID

**Learning**: RLS is crucial for security but requires careful policy design. Always test policies with multiple user accounts to ensure proper isolation.

---

### Problem 3: Real-time Updates Not Working

**Challenge**: Changes made in one browser tab weren't appearing in other tabs, breaking the real-time requirement.

**Root Cause**: The Realtime feature wasn't enabled on the bookmarks table, and the subscription wasn't properly configured.

**Solution**:
- Enabled Realtime on the bookmarks table: `alter publication supabase_realtime add table bookmarks;`
- Set up proper subscription with filtering: `supabase.channel('bookmarks').on('postgres_changes', { event: '*', schema: 'public', table: 'bookmarks', filter: `user_id=eq.${userId}` })`
- Implemented proper cleanup with `useEffect` return function to unsubscribe
- Added event handlers for both INSERT and DELETE operations

**Learning**: Realtime features need both database-level enabling and proper client-side subscription management. Always clean up subscriptions to prevent memory leaks.

---

### Problem 4: Environment Variables Not Loading in Production

**Challenge**: The application worked locally but failed to connect to Supabase after deploying to Vercel.

**Root Cause**: Environment variables weren't properly configured in Vercel, and I initially forgot the `NEXT_PUBLIC_` prefix.

**Solution**:
- Added `NEXT_PUBLIC_` prefix to environment variables that need to be accessible in the browser
- Configured environment variables in Vercel dashboard (not just .env.local)
- Triggered a new deployment after adding variables (changes require rebuild)
- Verified variables were accessible using `process.env` in the browser console

**Learning**: Next.js requires the `NEXT_PUBLIC_` prefix for client-side environment variables. Vercel deployments need explicit environment variable configuration.

---

### Problem 5: Hydration Mismatch Errors

**Challenge**: React hydration errors appeared in production, causing components to re-render unexpectedly.

**Root Cause**: Server-side rendering was producing different output than client-side rendering due to auth state not being available during SSR.

**Solution**:
- Used `useEffect` to handle auth-dependent rendering on the client only
- Implemented a loading state while auth state is being determined
- Ensured consistent rendering by checking for `typeof window !== 'undefined'`
- Moved auth-dependent logic to client components with 'use client' directive

**Learning**: SSR and authentication require careful handling. Always ensure server and client render the same initial content.

---

### Problem 6: URL Validation and Formatting

**Challenge**: Users were entering URLs without protocols (e.g., "google.com" instead of "https://google.com"), causing broken links.

**Root Cause**: No validation or automatic formatting of URLs before saving to database.

**Solution**:
- Implemented client-side validation using JavaScript's URL constructor
- Automatically prepended "https://" if no protocol was provided
- Added visual feedback for invalid URLs using error states
- Validated URL format with regex pattern before submission
- Added database constraint to ensure URLs are never empty

**Learning**: Never trust user input. Always validate and sanitize data on both client and server side. Provide helpful automatic corrections when possible.

---

### Problem 7: Session Persistence Issues

**Challenge**: Users were being logged out when refreshing the page or returning to the site.

**Root Cause**: Session wasn't being properly persisted across page loads and browser sessions.

**Solution**:
- Implemented Supabase's `onAuthStateChange` listener to detect session changes
- Used `getSession()` on component mount to restore existing sessions
- Configured Supabase client with proper storage options (localStorage)
- Set up middleware to verify sessions on protected routes

**Learning**: Modern auth systems require listening to auth state changes and properly managing session lifecycle.

---

### Problem 8: Mobile Responsiveness Issues

**Challenge**: The UI looked great on desktop but was cramped and difficult to use on mobile devices.

**Root Cause**: Initial design didn't consider mobile-first principles and relied too heavily on desktop dimensions.

**Solution**:
- Adopted mobile-first approach with Tailwind's responsive breakpoints
- Changed bookmark grid from 3 columns to 1 column on mobile (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Made form inputs full-width on mobile with proper touch targets (minimum 44px height)
- Tested on actual mobile devices using Chrome DevTools device emulation
- Adjusted font sizes and spacing for better mobile readability

**Learning**: Always design mobile-first and test on real devices. Touch targets should be large enough for fingers, not just mouse cursors.

---

### Problem 9: Delete Confirmation UX

**Challenge**: Users were accidentally deleting bookmarks with a single click, causing frustration.

**Root Cause**: Delete button had no confirmation dialog, making it too easy to trigger accidentally.

**Solution**:
- Implemented a modal confirmation dialog before deletion
- Added clear "Cancel" and "Delete" actions with different visual weights
- Used red color for the delete button to indicate danger
- Implemented keyboard shortcuts (Enter to confirm, Escape to cancel)
- Added a brief success toast after successful deletion

**Learning**: Destructive actions should always have confirmations. Good UX prevents user mistakes rather than just handling them.

---

### Problem 10: Loading States and User Feedback

**Challenge**: Users didn't know when actions were in progress, leading to duplicate submissions and confusion.

**Root Cause**: No visual feedback during async operations like adding or deleting bookmarks.

**Solution**:
- Added loading spinners to buttons during async operations
- Disabled form submission while requests were in progress
- Implemented optimistic UI updates for instant perceived performance
- Added toast notifications for success and error states
- Created skeleton loaders for initial data fetching

**Learning**: Users need constant feedback about what's happening. Loading states prevent confusion and duplicate actions.

---

## 🧪 Testing Instructions

### Test Google OAuth Login
1. Visit the live application URL
2. Click "Sign in with Google"
3. Select your Google account
4. Grant necessary permissions
5. Verify you're redirected to the dashboard

### Test Adding Bookmarks
1. Log in with Google
2. Enter a title (e.g., "Google")
3. Enter a URL (e.g., "https://google.com")
4. Click "Add Bookmark"
5. Verify bookmark appears immediately
6. Verify form clears after submission

### Test Real-time Synchronization
1. Log in with Google in one browser tab
2. Open the application in a second tab (same browser or different)
3. Ensure both tabs show the same bookmarks
4. Add a bookmark in the first tab
5. Verify it appears instantly in the second tab
6. Delete a bookmark in the second tab
7. Verify it disappears instantly in the first tab

### Test Private Bookmarks
1. Log in with your Google account
2. Add several bookmarks
3. Log out
4. Log in with a different Google account
5. Verify that you see NO bookmarks from the first account
6. Add bookmarks with the second account
7. Verify they don't appear in the first account's dashboard

### Test Delete Functionality
1. Log in with Google
2. Click the delete button on any bookmark
3. Verify a confirmation dialog appears
4. Click "Cancel" - bookmark should remain
5. Click delete again, then "Confirm"
6. Verify bookmark is removed immediately
7. Refresh the page to ensure deletion persisted

### Test Mobile Responsiveness
1. Open the application on a mobile device or use browser DevTools
2. Verify layout adjusts properly
3. Test all features work on mobile
4. Verify touch targets are large enough
5. Test in both portrait and landscape orientations

---

## 🎯 Future Improvements

If I had more time, I would add these features:

- **Bookmark Categories/Tags**: Organize bookmarks into folders or with tags
- **Search and Filter**: Find bookmarks quickly by title or URL
- **Bookmark Preview**: Show website favicon and Open Graph metadata
- **Export/Import**: Backup bookmarks as JSON or CSV
- **Dark Mode**: Toggle between light and dark themes
- **Keyboard Shortcuts**: Power user features for faster navigation
- **Analytics Dashboard**: Show statistics about bookmark usage
- **Share Bookmarks**: Generate shareable links for specific bookmarks
- **Browser Extension**: Quick bookmark saving from any website
- **Collections**: Create public or shared bookmark collections

---

## 📸 Screenshots

### Login Page
![Login Page](./screenshots/login.png)

### Dashboard with Bookmarks
![Dashboard](./screenshots/dashboard.png)

### Mobile View
![Mobile View](./screenshots/mobile.png)

### Real-time Sync Demo
![Real-time Sync](./screenshots/realtime.gif)

---

## 🤝 Contributing

This project was built as part of an internship assessment. If you'd like to suggest improvements:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m 'Add some improvement'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework and documentation
- **Supabase** for providing an excellent backend-as-a-service platform
- **Vercel** for seamless deployment experience
- **Tailwind CSS** for the utility-first CSS framework
- **Google** for OAuth authentication services

---

## 👨‍💻 Author

**Akshat Arora** ([@AKSHAT-ARORA03](https://github.com/AKSHAT-ARORA03))

Built with ❤️ for the Smart Bookmark Manager internship assessment.

---

## 📞 Support

If you have any questions or run into issues:

- Open an issue on GitHub
- Contact: [your-email@example.com](mailto:your-email@example.com)
- Documentation: [Next.js Docs](https://nextjs.org/docs) | [Supabase Docs](https://supabase.com/docs)

---

**Thank you for reviewing my project!** 🚀
