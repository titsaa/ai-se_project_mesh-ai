# MeshAI Server

This is the Express + TypeScript backend for the MeshAI application.

## Scripts

- `npm run dev` — run the server in development mode
- `npm run build` — compile the TypeScript project
- `npm run lint` — lint the server source
- `npm run test` — run the server test suite
- `npm start` — start the compiled production server

## Environment

The server expects a `.env` file with values such as:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `NEBIUS_API_KEY`

## Notes

- The API is mounted behind the `/api` route set by the Vite client proxy.
- Authentication is handled with JWT bearer tokens.
- Documents are processed and vectorized for the knowledge base flow.
