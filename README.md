[![GitHub Release Version](https://img.shields.io/github/v/release/smashedr/ai-chat-server?logo=github)](https://github.com/smashedr/ai-chat-server/releases/latest)
[![Workflow Build](https://img.shields.io/github/actions/workflow/status/smashedr/ai-chat-server/build.yaml?logo=norton&logoColor=white&label=build)](https://github.com/smashedr/ai-chat-server/actions/workflows/build.yaml)
[![Workflow Deploy](https://img.shields.io/github/actions/workflow/status/smashedr/ai-chat-server/deploy.yaml?logo=norton&logoColor=white&label=deploy)](https://github.com/smashedr/ai-chat-server/actions/workflows/deploy.yaml)
[![Workflow Release](https://img.shields.io/github/actions/workflow/status/smashedr/ai-chat-server/release.yaml?logo=norton&logoColor=white&label=release)](https://github.com/smashedr/ai-chat-server/actions/workflows/release.yaml)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/smashedr/ai-chat-server?logo=listenhub&label=updated)](https://github.com/smashedr/ai-chat-server/pulse)
[![GitHub Repo Size](https://img.shields.io/github/repo-size/smashedr/ai-chat-server?logo=buffer&label=repo%20size)](https://github.com/smashedr/ai-chat-server?tab=readme-ov-file#readme)
[![GitHub Top Language](https://img.shields.io/github/languages/top/smashedr/ai-chat-server?logo=devbox)](https://github.com/smashedr/ai-chat-server?tab=readme-ov-file#readme)
[![GitHub Contributors](https://img.shields.io/github/contributors-anon/smashedr/ai-chat-server?logo=southwestairlines)](https://github.com/smashedr/ai-chat-server/graphs/contributors)
[![GitHub Issues](https://img.shields.io/github/issues/smashedr/ai-chat-server?logo=codeforces&logoColor=white)](https://github.com/smashedr/ai-chat-server/issues)
[![GitHub Discussions](https://img.shields.io/github/discussions/smashedr/ai-chat-server?logo=theconversation)](https://github.com/smashedr/ai-chat-server/discussions)
[![GitHub Forks](https://img.shields.io/github/forks/smashedr/ai-chat-server?style=flat&logo=forgejo&logoColor=white)](https://github.com/smashedr/ai-chat-server/forks)
[![GitHub Repo Stars](https://img.shields.io/github/stars/smashedr/ai-chat-server?style=flat&logo=gleam&logoColor=white)](https://github.com/smashedr/ai-chat-server/stargazers)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=apachespark&logoColor=white&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-72a5f2?logo=kofi&label=support)](https://ko-fi.com/cssnr)

# AI Chat Server

<a title="AI Chat Server" href="https://github.com/smashedr/ai-chat-server?tab=readme-ov-file#readme" target="_blank">
<img alt="AI Chat Server" align="right" width="128" height="auto" src="https://raw.githubusercontent.com/smashedr/ai-chat-server/refs/heads/master/.github/assets/logo.svg"></a>

- [Setup](#Setup)
  - [Configure](#Configure)
- [Client](#Client)
  - [VitePress Plugin](#VitePress-Plugin)
- [Development](#Development)
- [Support](#Support)
- [Contributing](#Contributing)

AI Chat Server built with the [AI SDK](https://ai-sdk.dev/).

For a live demo see the VitePress Plugin docs: <https://smashedr.github.io/vitepress-chat/>

- Client: https://github.com/smashedr/vitepress-chat
- Server: https://github.com/smashedr/ai-chat-server

## Setup

Run with Docker.

```shell
docker run --rm -p 80:3000 --name ai-chat-server \
    -e MODEL=gemini-2.5-flash \
    -e GOOGLE_GENERATIVE_AI_API_KEY=xxx \
    ghcr.io/smashedr/ai-chat-server:latest
```

Run with Docker Compose.

```yaml
services:
  chat:
    image: ghcr.io/smashedr/ai-chat-server:latest
    environment:
      MODEL: 'gpt-5.4-mini'
      OPENAI_API_KEY: 'sk-proj-xxx'
    ports:
      - '80:3000'
```

Using Node.

```shell
npm i
npm start
```

Note: you will need to export or add your environment variables to the `settings.env` file.

For a Docker Swarm + Traefik + Basic Auth example see the [docker-compose-swarm.yaml](docker-compose-swarm.yaml).

For a Portainer Deploy workflow see the [.github/workflows/deploy.yaml](.github/workflows/deploy.yaml).

### Configure

Environment Variables

| Variable       | Req. | Default | Description         |
| :------------- | :--: | :------ | :------------------ |
| `MODEL`        | Yes  | -       | Model to Use        |
| `MAX_TOKENS`   |  -   | -       | Max Output Tokens   |
| `INSTRUCTIONS` |  -   | -       | System Instructions |
| `PORT`         |  -   | 3000    | Server Port         |

You must also set the API key for the MODEL you select.

| Variable                       | Description   |
| :----------------------------- | :------------ |
| `ANTHROPIC_API_KEY`            | Claude Models |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini Models |
| `OPENAI_API_KEY`               | OpenAI Models |

## Client

To send System Instructions from the client add them to the body.

```typescript
const chat = new Chat({
  transport: new DefaultChatTransport({
    api: 'https://ai-chat-server.cssnr.com/',
    headers: { Authorization: 'Basic Abc123=' },
    body: { system: 'You are a helpful assistant.' },
  }),
})
```

### VitePress Plugin

The client is currently available as a VitePress Plugin.

- https://github.com/smashedr/vitepress-chat

[![View Documentation](https://img.shields.io/badge/view_documentation-blue?style=for-the-badge&logo=googledocs&logoColor=white)](https://smashedr.github.io/vitepress-chat/)

## Development

Set your environment variables in the `settings.env` file.

With node run.

```shell
npm run dev
```

With Docker run.

```shell
docker compose -f docker-compose-dev.yaml up --watch --build --remove-orphans
```

Point your client to: http://localhost:3000/

### Building

To build and test the docker image run.

```shell
bash build.sh
docker compose up
```

## Support

If you run into any issues or need help getting started, please do one of the following:

- Report an Issue: <https://github.com/smashedr/ai-chat-server/issues>
- Q&A Discussion: <https://github.com/smashedr/ai-chat-server/discussions/categories/q-a>
- Request a Feature: <https://github.com/smashedr/ai-chat-server/issues/new?template=1-feature.yaml>
- Chat with us on Discord: <https://discord.gg/wXy6m2X8wY>

[![Features](https://img.shields.io/badge/features-brightgreen?style=for-the-badge&logo=rocket&logoColor=white)](https://github.com/smashedr/ai-chat-server/issues/new?template=1-feature.yaml)
[![Issues](https://img.shields.io/badge/issues-red?style=for-the-badge&logo=southwestairlines&logoColor=white)](https://github.com/smashedr/ai-chat-server/issues)
[![Discussions](https://img.shields.io/badge/discussions-blue?style=for-the-badge&logo=livechat&logoColor=white)](https://github.com/smashedr/ai-chat-server/discussions)
[![Discord](https://img.shields.io/badge/discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/wXy6m2X8wY)

## Contributing

Please consider making a donation to support the development of this project
and [additional](https://cssnr.com/) open source projects.

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/cssnr)

For a full list of current projects visit: [https://cssnr.github.io/](https://cssnr.github.io/)

<a href="https://github.com/smashedr/ai-chat-server/stargazers">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=smashedr/ai-chat-server&type=date&legend=bottom-right&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=smashedr/ai-chat-server&type=date&legend=bottom-right" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=smashedr/ai-chat-server&type=date&legend=bottom-right" />
 </picture>
</a>
