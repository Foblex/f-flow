# F-Assistant: Human-in-the-loop RAG bot for GitHub Issues/Discussions

This NestJS service builds draft answers for GitHub issues, discussions, or site questions and sends them to a Telegram admin for approval before posting back to GitHub. Responses are generated via a Retrieval-Augmented Generation (RAG) pipeline over repository code, docs, and past issues/discussions.

## Prerequisites
- Node.js 20+
- npm
- Docker (for Qdrant)

## Quickstart
1. Copy `.env.example` to `.env` and fill in required secrets.
2. Start Qdrant locally:
   ```bash
   docker compose -f docker-compose.yml up -d
   ```
3. Install dependencies and generate Prisma client:
   ```bash
   npm install
   npx prisma generate
   ```
4. Ingest the repository content into Qdrant:
   ```bash
   npm run ingest:repo
   ```
5. (Optional) Ingest GitHub issues/discussions history:
   ```bash
   npm run ingest:github -- --since=2024-01-01
   ```
6. Run the NestJS service in development mode:
   ```bash
   npm run start:dev
   ```
7. Use the Telegram bot (as admin) to draft an answer for an issue:
   ```
   /draft https://github.com/Foblex/f-flow/issues/123
   ```
   The bot will send three draft responses (Answer Pack). Approve one to publish back to GitHub.

## Notes
- The bot never posts to GitHub without explicit admin approval via Telegram.
- Preferred language can be set via `PREFERRED_LANGUAGE` (default `en`).
- The service uses OpenAI `gpt-5.2` for chat and `text-embedding-3-small` for embeddings.
