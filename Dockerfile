
FROM node:18.18.0

ENV FLAG_MOCK_CONFIG=true

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml* ./
COPY pnpm-workspace.yaml* ./

COPY . .

RUN pnpm install

RUN pnpm build

EXPOSE 3000

CMD [ "pnpm", "start" ]