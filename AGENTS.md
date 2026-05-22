# AI Chat Server — Agent Guide

## Commands

| Command                  | What it does                                                       |
| ------------------------ | ------------------------------------------------------------------ |
| `npm run dev`            | Hot-reload dev server (nodemon + tsx)                              |
| `npm start`              | Run compiled `dist/index.js`                                       |
| `npm run build`          | `npx tsc` — compiles `src/` → `dist/`                              |
| `npm run prettier:check` | Check formatting (no ESLint in this repo)                          |
| `npm run prettier:write` | Auto-format                                                        |
| `npm run prepare`        | Runs build (auto-triggers on `npm ci`/`npm i`)                     |
| `bash build.sh`          | Build Docker image tagged `ghcr.io/smashedr/ai-chat-server:latest` |

There are **no tests**. No test framework is installed.

## Project structure

- `src/index.ts` — sole source file, the app entrypoint (UI message stream endpoint)
- `dist/` — build output (gitignored)
- `settings.env` — env vars loaded by dotenv at startup (gitignored; see README for template)
- `build.sh` — Docker build helper (also sources `.env` if present, independent of dotenv)

## Env & configuration

Required: `MODEL` + one API key (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, or `GOOGLE_GENERATIVE_AI_API_KEY`).  
Optional: `MAX_TOKENS`, `INSTRUCTIONS`, `PORT` (default 3000).

## API

Single `POST /` endpoint. Accepts JSON body: `{ messages, system }`. Returns streamed UI message response via `ai` SDK's `pipeUIMessageStreamToResponse`.

## Lint / CI

- Prettier is the only code linter.
- CI also runs `yamllint` and `actionlint` (GitHub Actions config).

## Docker

- `docker compose -f docker-compose-dev.yaml up --watch --build --remove-orphans` — dev with file syncing
- `docker compose up` — runs pre-built image (requires `bash build.sh` first)
- Dockerfile uses `npm ci --ignore-scripts`, multi-stage, runs as `node` user
- CI builds multi-arch (`linux/amd64,linux/arm64`) and pushes to `ghcr.io/smashedr/ai-chat-server`

## Release flow

Draft → Publish → Build (Docker multi-arch push) → Deploy (Portainer swarm). Defined in `.github/workflows/release.yaml`.

## Prettier style (non-default)

`semi: false`, `singleQuote: true`, `printWidth: 90`. For `.vue` files: `printWidth: 120`. For `.html`, `.yaml`, `.yml`: `singleQuote: false`, `printWidth: 120`.
