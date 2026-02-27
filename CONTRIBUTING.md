# Contributing to Pik Pixel

Thank you for your interest in contributing to Pik Pixel. This document provides guidelines for contributing to the project.

## Development Setup

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Go >= 1.21
- Docker (for running services locally)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pik-pixel
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Copy the example environment files and configure them for your local setup:
   ```bash
   cp apps/console/.env.example apps/console/.env.local
   ```

4. **Run development servers**
   ```bash
   # Run all services
   pnpm dev

   # Or run specific app
   cd apps/console && pnpm dev
   ```

## Code Style

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the existing code style in the project
- Run linting before committing:
  ```bash
  pnpm lint
  ```

### Go

- Follow standard Go conventions
- Run gofmt before committing
- Ensure all tests pass:
  ```bash
  cd services/<service-name>
  go test ./...
  ```

### Git Commits

- Use clear, descriptive commit messages
- Reference issues in commit messages when applicable
- Follow conventional commits format:
  ```
  feat: add new tracking endpoint
  fix: resolve event validation error
  docs: update API documentation
  ```

## Testing

Run tests before submitting a pull request:

```bash
# All tests
pnpm test

# Specific app
cd apps/console && pnpm test
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all tests pass and linting is clean
4. Update documentation if needed
5. Submit a pull request

## Getting Help

- Open an issue for bugs or feature requests
- Join the community discussions
