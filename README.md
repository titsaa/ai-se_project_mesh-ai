# MeshAI

MeshAI is a full-stack retrieval-augmented generation (RAG) app. Users upload PDF documents to a personal knowledge base, and MeshAI answers questions in a chat interface using only the content of those documents.

**Live Demo at:** <https://todo-dev.crabdance.com/>

!!!! ps: My AWS account just went down so I have reached out to customer support and they gave me up to 24hrs to re-open it. I will make sure that the application is back online as soon as they do.


## How it works

1. **Upload**: a PDF is parsed with `pdf-parse`, split into 500-character chunks, and each chunk is embedded with `Qwen/Qwen3-Embedding-8B`.
2. **Store**: documents, chunks, and embeddings are saved in MongoDB, scoped to the user who uploaded them.
3. **Ask**: the question is embedded, the top 5 most similar chunks are ranked by cosine similarity, and those chunks are sent as context to `Qwen/Qwen3-30B-A3B-Instruct-2507`.
4. **Answer**: the model answers from the provided context only and says so when the context isn't enough. Chat history is saved per conversation.

Both models are served through the [Nebius Token Factory](https://tokenfactory.nebius.com/) OpenAI-compatible API.

## Tech stack

| Layer    | Tools                                                          |
| -------- | -------------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, React Router, react-markdown       |
| Backend  | Node.js, Express 5, TypeScript, Mongoose, Multer, JWT, bcrypt  |
| AI       | OpenAI SDK pointed at Nebius (Qwen3 embeddings and chat model) |
| Data     | MongoDB 7                                                      |
| Infra    | Docker Compose, Caddy (reverse proxy and automatic HTTPS)      |
| CI       | GitHub Actions (build and lint for client and server)         |

## Project structure

```
.
├── client/            # React + Vite frontend
│   └── src/
│       ├── components/    # App shell, layout, header, route guards, upload area
│       ├── contexts/      # Auth context
│       ├── pages/         # Intro, Login, Register, KnowledgeBase, Chat
│       └── utils/api.ts   # API client
├── server/            # Express + TypeScript API
│   └── src/
│       ├── controllers/   # auth, chats, messages, documents, query, users
│       ├── middleware/    # JWT auth, logging, error handling
│       ├── models/        # User, Document, Chunk, Chat, Message
│       ├── routes/
│       └── utils/         # chunking, embeddings, vector search, LLM client
├── .github/workflows/ci.yaml
├── compose.yaml       # mongo, backend, frontend, caddy
├── Caddyfile          # routes /api/* to the backend, everything else to the frontend
└── package.json       # root scripts to install and run both apps
```

## Getting started (local development)

### Prerequisites

- Node.js 20+
- A running MongoDB instance (local or Atlas)
- A Nebius API key

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure the server environment

Create `server/.env`:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/meshai
JWT_SECRET=your-jwt-secret
NEBIUS_API_KEY=your-nebius-key
```

If `MONGO_URI` is not set, the server falls back to `mongodb://127.0.0.1:27017/meshai`.

### 3. Run the app

```bash
npm run dev
```

This starts both apps with `concurrently`:

- API on `http://localhost:3000`
- Frontend on the Vite dev server (opens in the browser automatically)

The Vite dev server proxies `/api/*` to `http://localhost:3000` and strips the `/api` prefix, so the client always calls `/api/...`.

## Running with Docker

The `compose.yaml` stack runs MongoDB, the backend, the frontend (static build served by Caddy), and a Caddy reverse proxy on ports 80 and 443.

1. Copy the example environment file and fill it in:

   ```bash
   cp .env.example .env
   ```

   | Variable         | Description                                                                 |
   | ---------------- | --------------------------------------------------------------------------- |
   | `MONGO_URI`      | MongoDB connection string (for the bundled container: `mongodb://mongo:27017/meshai`) |
   | `JWT_SECRET`     | Secret used to sign auth tokens                                             |
   | `NEBIUS_API_KEY` | Nebius Token Factory API key                                                |
   | `SITE_ADDRESS`   | Domain Caddy serves (and issues a TLS certificate for), e.g. `meshai.example.com`. Use `:80` to serve plain HTTP locally. |

2. Build and start the stack:

   ```bash
   docker compose up -d --build
   ```

Uploaded files, MongoDB data, and Caddy certificates are kept in named volumes.

## API

All responses use the shape `{ success, data, error }`. Routes other than `/health` and `/auth/*` require an `Authorization: Bearer <token>` header. Behind Caddy or the Vite proxy, every path is prefixed with `/api`.

| Method | Path                  | Description                                          |
| ------ | --------------------- | ---------------------------------------------------- |
| GET    | `/health`             | Health check                                         |
| POST   | `/auth/register`      | Create an account                                    |
| POST   | `/auth/login`         | Log in and receive a JWT                             |
| GET    | `/users/me`           | Get the current user                                 |
| POST   | `/documents`          | Upload a PDF (`multipart/form-data`, field `file`, optional `title`) |
| GET    | `/documents`          | List the user's documents                            |
| DELETE | `/documents/:id`      | Delete a document and its chunks                     |
| POST   | `/chats`              | Create a chat                                        |
| GET    | `/chats`              | List the user's chats                                |
| GET    | `/chats/:id`          | Get a chat                                           |
| POST   | `/chats/:id/messages` | Ask a question in a chat (`{ question }`); saves both the question and the answer |
| POST   | `/query`              | One-off question against the knowledge base (`{ question }`) |

## Scripts

**Root**

- `npm run install:all`: install root, server, and client dependencies
- `npm run dev`: run server and client together

**Server** (`server/`)

- `npm run dev`: start with hot reload (nodemon + tsx)
- `npm run build`: compile TypeScript to `dist/`
- `npm start`: run the compiled server
- `npm run lint`: lint the source
- `npm test`: run tests with the Node test runner

**Client** (`client/`)

- `npm run dev`: start the Vite dev server
- `npm run build`: type-check and build for production
- `npm run preview`: preview the production build
- `npm run lint`: lint the source

## Continuous integration

`.github/workflows/ci.yaml` runs on pushes and pull requests to `main`. It installs dependencies, builds, and lints the server and client in separate jobs on Node 20.
