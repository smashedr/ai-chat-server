FROM node:lts-alpine

ENV TZ=UTC

LABEL org.opencontainers.image.source="https://github.com/smashedr/ai-chat-server"
LABEL org.opencontainers.image.description="AI Chat Server"
LABEL org.opencontainers.image.authors="smashedr"

#RUN apk add --no-cache curl

WORKDIR /app

COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY src/ ./src/

RUN --mount=type=cache,target=/root/.npm npm ci

ARG VERSION="Dockerfile"
ENV APP_VERSION="${VERSION}"
LABEL org.opencontainers.image.version="${VERSION}"

USER node

CMD ["npm", "start"]
