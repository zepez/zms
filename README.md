# Z Media Server (zms)

# Packages

- *packages/config-client* contains the public configuration. These values can be exposed to the client without leaking sensitive data.
- *packages/config-server* should only ever be used on the server to avoid leaking sensitive data. All client configuration values are also accessible here for convenience. Values are taken from environment variables.
- *packages/constant* contains values that are re-used multiple times, but do not change often. Co-located for convenience.
- *packages/web* is the Next.js server.


## Commands

| Command                   | Action                                    |
| ------------------------- | ----------------------------------------- |
| `nvm use`                 | Uses NVM to load the correct node version |
| `pnpm install`            | Install dependencies                     |
| `pnpm lint`               | Lint all `.ts` files                     |
| `pnpm clean`              | [Remove all generated artifacts](https://github.com/zepez/zms/blob/main/scripts/clean.sh)                              |
| `pnpm commit`             | Run `gitmoji` CLI                        |
| `pnpm dev`                | Start Next.js dev server on port 3000                        |


## Contributing

1. Ensure you have [nvm installed](https://github.com/nvm-sh/nvm).
   
   Run `nvm use` to ensure your environment is running the correct version of Node. 

2. Ensure that you have [pnpm installed](https://pnpm.io/installation). 

3. Run `pnpm install`

4. Check out a new branch with `git checkout your-initials/feature-name`. For example, `git checkout az/google-oauth`

5. Make any changes.

6. Stage changes with `git add .`

7. Commit changes with gitmoji cli by running `pnpm commit`