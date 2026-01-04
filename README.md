# ProjectFolio

A modern developer portfolio and project showcase platform built with Next.js. ProjectFolio enables developers to create professional profiles, showcase their work, and engage with the developer community.

## Features

- Developer profile management
- Project showcase with grid layout
- Interactive features (likes, comments)
- Secure authentication system
- Fully responsive design
- Optimized performance

## Tech Stack

**Frontend:** Next.js, React, Tailwind CSS, shadcn/ui, Lucide Icons

**Backend:** Next.js API Routes, Node.js, MongoDB, Mongoose

**Authentication:** NextAuth.js with JWT

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/projectfolio.git
cd projectfolio
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables

Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
projectfolio/
├── app/              # Next.js app directory
│   ├── api/          # API routes
│   ├── (auth)/       # Authentication pages
│   └── (dashboard)/  # Dashboard pages
├── components/       # React components
│   └── ui/           # shadcn/ui components
├── lib/              # Utility functions
├── models/           # Database models
├── types/            # TypeScript types
└── public/           # Static assets
```

## Roadmap

- Search and filter functionality
- Project bookmarking
- Analytics dashboard
- Public user profiles
- Admin panel

## Author

**Saurabh**  
BCA Student | Full-Stack Developer

## License

This project is licensed under the MIT License.

---

⭐ Found this helpful? Star the repository!