# Z Media Server (zms)


# Setup

This template relies on LibSQL (Turso) as the database engine: 

```
turso db create <name> --enable-extensions
```

## Commands

| Command                  | Action                                    |
| ------------------------ | ----------------------------------------- |
| `nvm use`                | Uses NVM to load the correct node version |
| `pnpm install`            | Install dependencies                      |
| `pnpm lint`               | Lint all `.ts` files                      |
| `pnpm clean`              | [Remove all generated artifacts](https://github.com/zepez/monorepo/blob/main/scripts/clean.sh)                             |
| `pnpm commit`             | Run `gitmoji` CLI                         |
| `pnpm dev`                | Start Next.js dev server on port 3000                       |
| `pnpm db:empty`           | Permanently delete all tables and data from the database                   |
| `pnpm db:generate`        | Generate DrizzleORM migration files       |
| `pnpm db:migrate`         | Run DrizzleORM migration                  |
| `pnpm db:studio`          | Start Drizzle Studio on port 8080         |
