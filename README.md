# nextjs-functional-dip

A small, function-based layered architecture for Next.js with the Dependency Inversion Principle (DIP)
applied at a single boundary. Next.js (SSG) + TypeScript, built from functions and plain objects — no classes.

Companion code for the article *Only the DIP from Clean Architecture, for the Frontend*
([English](https://sumisonic.com/en/writing/nextjs-functional-dip/) /
[日本語](https://sumisonic.com/ja/writing/nextjs-functional-dip/)).
The sample fetches posts (list + detail) from JSONPlaceholder.

## Layout

```
src/
├── app/            # Next.js routing + composition roots (assemble the implementations from the environment)
├── domain/         # Contracts and types: PostUseCase (interface) / PostModel / Result / DomainError
├── platform/       # Implementations: ApiClient (fetch / mock) / repository / PostUseCase implementation
└── presentation/   # React components (depend only on the domain contracts)
```

Dependencies point `presentation → domain ← platform`. domain imports nothing from the outer layers.

This repository is not an implementation of DDD or of "The Clean Architecture" (the concentric circles).
It is a small layered setup that applies dependency inversion at one boundary: the use-case contract lives in
domain and platform implements it. The names `domain` / `usecases` / `repositories` are used in their general
sense (the app's core types, the boundary for operations, the boundary for data access).

## Running it

Requirements: Node.js >= 20.9 (`.node-version` says 22.14.0), pnpm 10 (`corepack enable` recommended)

```bash
pnpm install
pnpm dev          # dev server (talks to JSONPlaceholder)
pnpm dev:mock     # dev server (MockApiClient, no network access)
```

| Command | Description |
|---|---|
| `pnpm build` | SSG build (fetches every post from JSONPlaceholder and renders it statically) |
| `pnpm build:mock` | SSG build with mock data (works offline) |
| `pnpm start` | Serves the build output (`serve out`) |
| `pnpm check` | lint + type-check |
| `pnpm test:run` | Unit tests (MockApiClient-based, no network access) |

## License

MIT
