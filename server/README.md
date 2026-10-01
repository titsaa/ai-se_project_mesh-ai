# MeshAI

A full-stack AI assistant app. Users can upload documents to a 
knowledge base and query them through a chat interface. Utilizes
RAG via MongoDB and OpenAI.

**Live:** <https://todo-dev.crabdance.com/>

## Tech stack

- React
- TypeScript
- Express
- MongoDB
- Docker
- Caddy
- AWS EC2
- GitHub Actions

## Getting started

Prerequisites: Node.js 20+, Docker

1. Clone the repository.
2. `cd` into it.
3. Copy `.env.example` to `.env` and fill in the required values.
4. Start the app for development by running `npm run dev` in the root directory.
5. Run the Docker containers with `docker compose up --build`.

## Required environment variables

| Variable | Description |
| --- | --- |
| `JWT_SECRET` | Secret key used to sign authentication tokens |
| `NEBIUS_API_KEY` | API key for the Nebius AI service |
| `MONGO_URI` | MongoDB connection string |
| `SITE_ADDRESS` | Domain name used by Caddy (production only) |