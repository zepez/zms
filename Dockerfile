FROM node:18.18.0 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ENV FLAG_MOCK_CONFIG=true
RUN pnpm build

FROM base AS run
ENV CHOKIDAR_USEPOLLING=true
COPY --from=build /usr/src/app /usr/src/app
WORKDIR /usr/src/app
EXPOSE 3000
CMD [ "pnpm", "start" ]
