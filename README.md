# Pik Pixel

A modern tracking pixel analytics platform built with turborepo.

## Overview

Pik Pixel is a monorepo project for building a comprehensive tracking and analytics platform. It uses turborepo for managing multiple applications and packages.

## Tech Stack

- **Package Manager**: pnpm
- **Build Tool**: Turborepo
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **API**: Express/Node.js

## Project Structure

```
pik-pixel/
├── apps/
│   └── dashboard/         # Next.js web dashboard
├── packages/
│   └── @pik-pixel/
│       └── types/         # Shared TypeScript types
├── turbo.json            # Turborepo configuration
├── pnpm-workspace.yaml   # pnpm workspace configuration
└── package.json          # Root package.json
```

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run specific app
cd apps/dashboard
pnpm dev
```

### Building

```bash
# Build all packages and apps
pnpm build
```

### Testing

```bash
# Run tests across all packages
pnpm test
```

## Available Scripts

- `pnpm dev` - Run all apps in development mode
- `pnpm build` - Build all apps and packages
- `pnpm test` - Run tests
- `pnpm lint` - Run linting
- `pnpm type-check` - Run TypeScript type checking
- `pnpm clean` - Clean build artifacts

## Architecture

This monorepo follows a well-organized structure:

- **apps/**: Deployable applications (dashboards, APIs, etc.)
- **packages/**: Shared code that can be reused across apps
- **packages/@pik-pixel/**: Scoped packages for the Pik Pixel ecosystem

## License

MIT
