# Social Polling App

A real-time social polling application built with Next.js, Supabase, and TypeScript.

## Features

- **User Authentication**: Email/password authentication with Supabase Auth
- **Poll Creation**: Create polls with multiple options
- **Real-time Voting**: Vote on polls with live result updates
- **Results Dashboard**: View poll results with progress bars and percentages
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database & Auth**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone (https://github.com/themohesh/novelfinancials-assignment.git)
   cd novelfinancials-assignment
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

Fill in your Supabase project details in `.env.local` and `.env.example`.

4. Set up the database:

   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Run the SQL commands from `supabase/setup.sql`

5. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## screenshot of ui's url

1. https://github.com/themohesh/novelfinancials-assignment/blob/master/public/signup.png
2. https://github.com/themohesh/novelfinancials-assignment/blob/master/public/signin.png
3. https://github.com/themohesh/novelfinancials-assignment/blob/master/public/poll-dashboard.png
4. https://github.com/themohesh/novelfinancials-assignment/blob/master/public/poll-ui.png
5. https://github.com/themohesh/novelfinancials-assignment/blob/master/public/pie-chart.png
6. https://github.com/themohesh/novelfinancials-assignment/blob/master/public/bar-chart.png
7. https://github.com/themohesh/novelfinancials-assignment/blob/master/public/create-new-poll.png

## Database Schema

The application uses the following main tables:

- `profiles`: User profiles (extends auth.users)
- `polls`: Poll information
- `poll_options`: Options for each poll
- `votes`: User votes (one per user per poll)

## API Routes

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/polls` - Get all polls
- `POST /api/polls` - Create a new poll
- `GET /api/polls/[id]` - Get specific poll
- `POST /api/polls/[id]/vote` - Vote on a poll

## Deployment

The app is deployed on Vercel:
URL-- https://novelfinancials-assignment.vercel.app/auth/login

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
