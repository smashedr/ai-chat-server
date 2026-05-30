# AI Chat Server — Agent Guide

## Commands

| Command                  | What it does                                                       |
| ------------------------ | ------------------------------------------------------------------ |
| `npm run dev`            | Hot-reload dev server (nodemon + tsx)                              |
| `npm start`              | Run compiled `dist/index.js`                                       |
| `npm run build`          | `npx tsc` — compiles `src/` → `dist/`                              |
| `npm run lint`           | ESLint on `src/`                                                   |
| `npm run prettier:check` | Check formatting                                                   |
| `npm run prettier:write` | Auto-format                                                        |
| `npm run prepare`        | Runs build (auto-triggers on `npm ci`/`npm i`)                     |
| `bash build.sh`          | Build Docker image tagged `ghcr.io/smashedr/ai-chat-server:latest` |

No test framework is installed.

## Env & configuration

Required: `MODEL` + matching API key (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, or `GOOGLE_GENERATIVE_AI_API_KEY`).  
Optional: `MAX_TOKENS`, `INSTRUCTIONS`, `CORS_ORIGINS` (comma/space/newline-separated), `AI_SDK_LOG_WARNINGS` (set `false` to suppress SDK warnings), `PORT` (default 3000).

**Model provider routing** (`src/index.ts:79-92`): `MODEL` starting with `gemini` → Google provider, containing `gpt` → OpenAI, anything else → Anthropic.  
**gpt-5 provider options** (`src/index.ts:94-108`): `reasoningEffort` is `minimal` for `gpt-5` family, `none` for `gpt-5.*` sub-models.

## Project structure

- `src/index.ts` — sole source file, entrypoint (proxy chat server for VitePress client)
- `dist/` — build output (gitignored)
- `settings.env` — gitignored, loaded by dotenv at startup; copy env vars from README
- `render.yaml` — Render deploy config (pulls pre-built image from ghcr.io)
- `build.sh` — Docker build helper (also sources `.env` if present)

## API

Single `POST /`. Accepts JSON body: `{ messages, system }`. Returns streamed UI message via `ai` SDK's `pipeUIMessageStreamToResponse`.

## Lint / CI

Linters run in CI: ESLint (`npm run lint`), Prettier (`npm run prettier:check`), yamllint, actionlint.  
Commit message flag `#nolint` skips lint workflow; `#norender` skips render deploy. CI uses Node 24.

## Docker

- Dev: `docker compose -f docker-compose-dev.yaml up --watch --build --remove-orphans`
- Run pre-built: `docker compose up` (requires `bash build.sh` first)
- Dockerfile: `npm ci --ignore-scripts`, multi-stage, runs as `node` user
- CI builds multi-arch (`linux/amd64,linux/arm64`) with buildx and pushes to `ghcr.io/smashedr/ai-chat-server`

## Deploy

Release flow: Draft (`draft.yaml`) → Publish → Build (`build.yaml`, multi-arch Docker push) → Deploy (`deploy.yaml`, Portainer swarm via `docker-compose-swarm.yaml` with Traefik).  
Render: `render.yaml` deploys ghcr.io image; triggerable via `render.yaml` workflow.

## AI Issue Triage

`issue.yaml` feeds `README.md` and this file as context to Gemini when auto-responding to opened issues.

## Prettier style (non-default)

`semi: false`, `singleQuote: true`, `printWidth: 90`. Overrides: `.vue` → `printWidth: 120`; `.html`, `.yaml`, `.yml` → `singleQuote: false`, `printWidth: 120`.
