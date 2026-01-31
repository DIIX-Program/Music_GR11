# Music Streaming Platform

Fullstack Music Streaming Application (Modular Monolith Architecture).

## Structure

- **client/**: React + Vite + TailwindCSS Frontend.
- **server/**: Node.js + Express + Prisma Backend.

## Prerequisites

- Node.js (LTS)
- Docker (optional, for DB)
- PostgreSQL or MySQL (via local or Docker)

## Getting Started

### Backend

1. Navigate to `server/`
2. `npm install`
3. Setup `.env`
4. `npx prisma migrate dev`
5. `npm run dev`

### Frontend

1. Navigate to `client/`
2. `npm install`
3. `npm run dev`

## Architecture

This project follows a Modular Monolith approach.
- **API**: RESTful, documented in `server/README.md` (to be created).
- **Core**: Express.js
- **DB**: Prisma ORM
