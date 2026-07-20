# DataArena — Documentation Index

All project documentation lives in this folder.

| Document | Purpose |
|----------|---------|
| [SETUP_AND_RUN.md](./SETUP_AND_RUN.md) | **Detailed setup & run guide** — first-time setup, terminals, commands, troubleshooting |
| [DataArena_Product_Documentation_v1.md](./DataArena_Product_Documentation_v1.md) | Original product vision and requirements (your source doc) |
| [DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md) | Versioned record of everything built so far (updated after each milestone) |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Full technical, functional, and product architecture (current + future) |

## How these files are maintained

- **DEVELOPMENT_LOG.md** — Append a new version section after every meaningful change. Older versions are never removed.
- **ARCHITECTURE.md** — Updated when architecture decisions change or new modules are planned.
- **DataArena_Product_Documentation_v1.md** — Preserved as the original product brief. New product versions can be added alongside it if needed.

## Git

The `docs/` folder is **intentionally tracked in git** and must be committed with the project. It is not in `.gitignore`.

If you initialize git from the **project root** (`dataArena/`), all files in `docs/` will be included when you push.
