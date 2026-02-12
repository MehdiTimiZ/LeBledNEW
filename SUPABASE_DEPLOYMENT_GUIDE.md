# LeBled Supabase Deployment Guide

This guide will walk you through deploying the LeBled database schema to your Supabase project.

## 📋 Prerequisites

- ✅ Supabase project created: `https://awomvotjombcemvfnzxa.supabase.co`
- ✅ Environment variables configured in `.env.local`
- ✅ Supabase client library installed

## 🚀 Step 1: Deploy Database Schema

### 1.1 Navigate to SQL Editor

1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/awomvotjombcemvfnzxa
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query** button

### 1.2 Execute Migration Script

1. Open the migration file: [`supabase/migrations/initial_schema.sql`](file:///c:/Users/I589654/OneDrive%20-%20SAP%20SE/Desktop/LeBled/LEBLED-DZ/LeBledNEW/supabase/migrations/initial_schema.sql)
2. **Copy the entire contents** of the file
3. **Paste** into the SQL Editor in Supabase
4. Click **Run** (or press `Ctrl+Enter`)

> [!IMPORTANT]
> Wait for the execution to complete. You should see a success message like:
> 
> ✅ `Success. No rows returned`

This script is **idempotent** - it's safe to run multiple times without causing errors.

### 1.3 Verify Schema Creation

1. Click **Table Editor** in the left sidebar
2. You should see these tables:
   - ✅ `profiles`
   - ✅ `user_status`
   - ✅ `listings`
   - ✅ `conversations`
   - ✅ `messages`
   - ✅ `community_posts`
   - ✅ `community_likes`
   - ✅ `community_comments`
   - ✅ `charity_events`
   - ✅ `event_participants`
   - ✅ `announcements`
   - ✅ `security_logs`

---

## 📡 Step 2: Enable Realtime Replication

Real-time features require explicit replication enablement for each table.

### 2.1 Navigate to Replication Settings

1. Go to **Database** → **Replication** in the Supabase Dashboard
2. Find the **Replication** section

### 2.2 Enable Tables

Enable replication for these tables (click the toggle switch next to each):

- ✅ `messages` (for live chat)
- ✅ `conversations` (for inbox updates)
- ✅ `community_posts` (for social feed)
- ✅ `community_likes` (for like updates)
- ✅ `community_comments` (for comment updates)
- ✅ `user_status` (for admin presence tracking)
- ✅ `security_logs` (for security dashboard)

> [!NOTE]
> After enabling, each table should show **"Enabled"** status

---

## 💾 Step 3: Create Storage Buckets

The application uses two storage buckets for file uploads.

### 3.1 Navigate to Storage

1. Go to **Storage** in the Supabase Dashboard
2. Click **Create a new bucket**

### 3.2 Create Message Attachments Bucket

1. **Bucket name**: `message-attachments`
2. **Public bucket**: ❌ **Unchecked** (Private)
3. **Allowed MIME types**: Leave default or specify: `image/*`, `application/pdf`, `video/*`
4. **File size limit**: `10 MB`
5. Click **Create bucket**

### 3.3 Create Community Media Bucket

1. Click **Create a new bucket** again
2. **Bucket name**: `community-media`
3. **Public bucket**: ✅ **Checked** (Public)
4. **Allowed MIME types**: `image/*`
5. **File size limit**: `5 MB`
6. Click **Create bucket**

### 3.4 Verify Buckets

Both buckets should appear in your Storage dashboard:
- ✅ `message-attachments` (Private)
- ✅ `community-media` (Public)

---

## 🧪 Step 4: Test the Deployment

### 4.1 Start Development Server

```powershell
npm run dev
```

### 4.2 Verify Environment Variables

1. Open your browser console (F12)
2. Check for any environment variable errors
3. **Expected**: No errors about missing `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY`

### 4.3 Test User Registration

1. Navigate to your application (typically `http://localhost:5173`)
2. Attempt to **sign up** with a test account
3. Enter test credentials (e.g., `test@example.com` / password)

### 4.4 Verify Auto-Profile Creation

1. Go back to Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Verify your test user appears in the list
4. Go to **Table Editor** → **profiles**
5. **Confirm**: A profile row was automatically created for your test user
6. Go to **Table Editor** → **user_status**
7. **Confirm**: A status row was automatically created

> [!TIP]
> If the profile wasn't created automatically, check the **Database** → **Functions** section to ensure `handle_new_user()` and `create_user_status()` functions exist.

---

## ✅ Deployment Complete!

Your LeBled application is now connected to Supabase with a complete database schema.

### What You've Deployed

- **12 Tables** with full schema and indexes
- **Row Level Security (RLS)** policies for data protection
- **Auto-triggers** for profile/status creation
- **Real-time replication** for live updates
- **Storage buckets** for file uploads

### Next Steps

- **Integrate Authentication**: Update your `App.tsx` to use the Supabase auth from `services/supabaseClient.ts`
- **Build Features**: Start implementing marketplace listings, chat, community posts, and charity events
- **Deploy to Production**: When ready, deploy to Vercel (already configured in `vercel.json`)

### Troubleshooting

If you encounter issues:

1. **500 Error during signup**: Check that both triggers exist and have unique names
2. **No profile created**: Run the migration script again (it's idempotent)
3. **Real-time not working**: Verify replication is enabled for the specific table
4. **Storage upload fails**: Check bucket policies in **Storage** → **Policies**

---

**Need Help?** Check the [Backend Engineering docs](file:///C:/Users/I589654/.gemini/antigravity/knowledge/lebled_project_reference/artifacts/implementation/backend_engineering_and_infrastructure.md) in the knowledge base.
