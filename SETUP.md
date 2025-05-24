# Setup Guide for Social Polling App

## 1. Supabase Project Setup

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project name: "social-polling-app"
5. Enter a secure database password
6. Choose a region close to your users
7. Click "Create new project"

### Step 2: Get Your Project Credentials
1. Go to your project dashboard
2. Click on "Settings" in the sidebar
3. Click on "API" 
4. Copy the following values:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### Step 3: Set Up Database Schema
1. In your Supabase dashboard, go to "SQL Editor"
2. Click "New Query"
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click "Run" to execute the schema

### Step 4: Configure Environment Variables
The environment variables have already been added to your Vercel project. You can verify them by:
1. Going to your Vercel dashboard
2. Selecting your project
3. Going to Settings > Environment Variables
4. Ensuring these variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 5: Enable Realtime (Optional but Recommended)
1. In Supabase dashboard, go to "Database" > "Replication"
2. Enable realtime for the following tables:
   - `polls`
   - `poll_options` 
   - `votes`

## 2. Local Development Setup

### Step 1: Clone and Install
\`\`\`bash
git clone <your-repo-url>
cd social-polling-app
npm install
\`\`\`

### Step 2: Environment Variables for Local Development
Create a `.env.local` file in your project root:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### Step 3: Run Development Server
\`\`\`bash
npm run dev
\`\`\`

## 3. Testing the Setup

### Test Authentication
1. Go to `http://localhost:3000/auth/signup`
2. Create a new account
3. Check if you're redirected to the main page

### Test Poll Creation
1. Click "Create Poll"
2. Fill out the form
3. Submit and verify the poll appears

### Test Voting
1. Click on a poll option
2. Click "Vote"
3. Verify results update in real-time

## 4. Deployment

The app is already configured for Vercel deployment:
1. Push your code to GitHub
2. Connect the repository to Vercel
3. The environment variables are already set
4. Deploy!

## 5. Troubleshooting

### Common Issues:

**"Missing Supabase environment variables" error:**
- Verify your environment variables are set correctly
- Make sure they start with `NEXT_PUBLIC_`
- Restart your development server after adding variables

**Database connection issues:**
- Verify your Supabase project is active
- Check that the database schema has been applied
- Ensure RLS policies are enabled

**Authentication not working:**
- Check that your Supabase project has email authentication enabled
- Verify the redirect URLs in Supabase Auth settings

**Real-time updates not working:**
- Enable realtime replication for the required tables
- Check browser console for WebSocket connection errors

## 6. Next Steps

Once everything is working:
1. Customize the styling to match your brand
2. Add more poll types (multiple choice, ranked choice, etc.)
3. Implement poll categories and search
4. Add user profiles and poll history
5. Implement poll sharing features
\`\`\`

Now your app should work properly! The key changes I made:

1. **Added proper error handling** for missing environment variables
2. **Updated middleware** to gracefully handle missing credentials
3. **Created a comprehensive setup guide** to help you configure Supabase

The environment variables are now set in your Vercel project, so when you deploy, everything should work seamlessly. For local development, you'll need to create a `.env.local` file with your Supabase credentials.
