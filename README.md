<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# LeBled Marketplace

A modern marketplace and community platform for Algeria, built with React 19, Vite, and Supabase.

## Features

- 🏪 **Marketplace**: Buy and sell items with detailed listings
- 💬 **Real-time Chat**: Direct messaging between buyers and sellers
- 🌍 **Community Hub**: Social posts, likes, and comments
- 🤝 **Charity Events**: Community event participation and tracking
- 👥 **Admin Panel**: User management and platform governance
- 🔒 **Secure Authentication**: Supabase Auth with Row Level Security

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd LeBledNEW
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env.local` and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```
   
   Required variables:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key
   - `VITE_GEMINI_API_KEY` - Google Gemini API key (optional, for AI features)

4. **Deploy database schema**
   
   Follow the comprehensive guide in [`SUPABASE_DEPLOYMENT_GUIDE.md`](./SUPABASE_DEPLOYMENT_GUIDE.md) to:
   - Execute the database migration
   - Enable Realtime replication
   - Create storage buckets
   - Test your deployment

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## Project Structure

```
LeBledNEW/
├── components/          # React components
├── services/           # API services (Supabase, Gemini)
├── supabase/           # Database migrations
│   └── migrations/     # SQL schema files
├── App.tsx             # Main application
├── index.tsx           # Entry point
└── types.ts            # TypeScript definitions
```

## Documentation

- **[Supabase Deployment Guide](./SUPABASE_DEPLOYMENT_GUIDE.md)** - Complete database setup instructions
- **[Backend Engineering](C:/Users/I589654/.gemini/antigravity/knowledge/lebled_project_reference/artifacts/implementation/backend_engineering_and_infrastructure.md)** - Technical infrastructure reference

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **UI**: Tailwind CSS, Lucide Icons
- **AI**: Google Gemini API
- **Deployment**: Vercel (Primary), Firebase/Cloud Run (Secondary)

## License

Private project - All rights reserved
AI Studio: https://ai.studio/apps/drive/1G6sUQOdlWKHld8rVoLGaB95npA2xdpN0

## Run Locally

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
