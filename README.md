# Flash Game Website by VuongDQ

A modern web application for hosting and playing Flash games, built with Next.js, MongoDB, and Ruffle Flash Emulator.

## Features

- 🎮 Flash Game Emulation using Ruffle
- 👤 User Authentication System
- 🎯 Game Categories and Tags
- 📱 Responsive Design
- 🔍 Search Functionality
- 📊 Admin Dashboard
- 🖼️ Thumbnail Generation
- 📈 Game Analytics (Play Count)

## Tech Stack

- **Frontend:**
  - Next.js
  - React
  - Tailwind CSS
  - Ruffle Flash Emulator

- **Backend:**
  - Node.js
  - MongoDB
  - Mongoose

- **Image Processing:**
  - Sharp
  - Formidable

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/flash-game-website.git
cd flash-game-website
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Create required directories:
```bash
# Windows
mkdir public\games
mkdir public\thumbnails

# Linux/Mac
mkdir -p public/games
mkdir -p public/thumbnails
```

5. Run the development server:
```bash
npm run dev
```

## Project Structure

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
