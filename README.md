# 🚀 Cookieless Tracking & Attribution SaaS Platform

[![Turborepo](https://img.shields.io/badge/Powered%20by-Turborepo-orange?style=flat&logo=turborepo)](https://turborepo.org)
[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat&logo=go)](https://go.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-latest-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-latest-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-latest-326CE5?style=flat&logo=kubernetes)](https://kubernetes.io/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-FF8000?style=flat&logo=cloudflare)](https://workers.cloudflare.com/)

## Table of Contents

1.  [Project Overview](#1-project-overview)
    *   [Problem Statement](#problem-statement)
    *   [Solution & Core Features](#solution--core-features)
    *   [Architectural Principles](#architectural-principles)
2.  [High-Level Architecture](#2-high-level-architecture)
3.  [Monorepo Structure (Turborepo)](#3-monorepo-structure-turborepo)
    *   [Apps](#apps)
    *   [Services](#services)
    *   [Packages (Internal Libraries)](#packages-internal-libraries)
    *   [Infrastructure (IaC)](#infrastructure-iac)
4.  [Technology Stack](#4-technology-stack)
5.  [Getting Started](#5-getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Local Development Setup](#local-development-setup)
    *   [Running Services](#running-services)
    *   [Building & Testing](#building--testing)
6.  [Deployment](#6-deployment)
7.  [Contributing](#7-contributing)
8.  [Security & Privacy](#8-security--privacy)
9.  [Support](#9-support)
10. [License](#10-license)

---

## 1. Project Overview

This platform is a privacy-first, cookieless event tracking and attribution system designed for the modern web. It provides a robust, scalable, and compliant solution for businesses to understand user behavior and campaign performance without relying on third-party cookies or intrusive tracking methods.

### Problem Statement

The deprecation of third-party cookies, coupled with increasing user privacy demands and stricter regulations (GDPR, CCPA, ePrivacy), has rendered traditional analytics and attribution systems less effective and often non-compliant. Businesses need a reliable way to collect first-party behavioral data, model user sessions anonymously, and accurately attribute conversions to marketing efforts in a privacy-respecting manner.

### Solution & Core Features

Our platform addresses these challenges by offering:

*   **Cookieless Tracking:** Collects first-party behavioral events without using cookies or local storage, relying on advanced server-side heuristics.
*   **Anonymous Session Modeling:** Generates unique, privacy-preserving session IDs based on hashed client characteristics, ensuring no persistent cross-site identifiers.
*   **Flexible Attribution:** Supports various attribution models (First-Touch, Last-Touch, Time-Decay) configurable per project.
*   **Real-time Analytics:** Provides low-latency dashboards for immediate insights into event streams, conversion rates, and campaign performance.
*   **Privacy by Design:** Immediate IP hashing, no raw personal data storage, configurable data retention, and compliance with major privacy regulations (GDPR, CCPA).
*   **Extreme Scalability:** Built on an event-driven, distributed architecture capable of handling millions of events per second.

### Architectural Principles

*   **Privacy by Design:** Integrated into every layer, from ingestion to storage.
*   **Stateless Ingestion:** Maximizes throughput and horizontal scalability.
*   **Event Immutability:** Events are recorded as they happen, ensuring data integrity.
*   **Horizontal Scalability:** All core components are designed to scale out independently.
*   **Queue-Based Decoupling:** Enhances reliability, resilience, and allows for backpressure handling.
*   **Write-Optimized Storage:** For high-volume raw event ingestion.
*   **Low-Latency Read API:** For real-time dashboard responsiveness.
*   **Domain-Driven Design (DDD):** Clear boundaries and responsibilities for each service.

---

## 2. High-Level Architecture

The system is built on an event-driven, distributed architecture with ingestion, processing, storage, and analytics layers separated for scalability and reliability.

```
graph TD
    subgraph Client Website
        A[Tracking Pixel (JS)]
    end

    subgraph Edge Network
        B[Edge / CDN Layer (Cloudflare Worker)]
    end

    subgraph Backend Services
        C[Event Ingestion API (Go)]
        D[Message Queue (Kafka)]
        E[Event Transformer (Go)]
        F[Attribution Engine (Go)]
        G[Raw Event Store (ClickHouse)]
        H[Aggregated Metrics Store (PostgreSQL)]
        I[Query API (Node.js)]
        J[Admin Service (Go)]
    end

    subgraph Analytics & Management
        K[Dashboard Frontend (Next.js)]
    end
```

---

## 3. Monorepo Structure (Turborepo)

This project uses [Turborepo](https://turborepo.org) to manage a monorepo containing multiple applications, services, and shared packages.

```
/platform/
├── apps/                    # User-facing applications and APIs
│   ├── dashboard/           # Next.js frontend for analytics dashboard
│   ├── query-api/           # Node.js API for serving analytics data to the dashboard
│   └── tracking-pixel/      # Client-side JS library for collecting events
├── services/                # Core backend microservices
│   ├── ingestion-api/       # Go service for raw event reception and queuing
│   ├── event-transformer/   # Go service for event normalization and enrichment
│   ├── attribution-engine/  # Go service for session modeling, attribution, and aggregations
│   ├── edge-worker/         # TypeScript service for Cloudflare/Fastly edge logic
│   └── admin-service/       # Go service for internal administration and data management (e.g., deletion API)
├── packages/                # Internal libraries and shared code
│   ├── ui/                  # Reusable React UI components
│   ├── @platform/types/     # Shared TypeScript types and interfaces
│   ├── @platform/go-sdk/    # Shared Go library for common types, Kafka clients, DB wrappers
│   ├── @platform/eslint-config/ # Shared ESLint configurations
│   ├── @platform/tsconfig/  # Shared TypeScript configurations
│   └── @platform/proto/     # Protobuf definitions and generated code
├── infra/                   # Infrastructure as Code (Terraform, Kubernetes manifests, Helm)
├── scripts/                 # Utility scripts for local dev, deployment, etc.
└── ... (root configuration files: package.json, turbo.json, tsconfig.json)
```

### Apps

*   **`apps/dashboard`**: The main user interface for viewing analytics, configuring projects, and managing attribution models. Built with Next.js and React.
*   **`apps/query-api`**: A Node.js API layer that serves data from the `Aggregated Metrics Store` and `Raw Event Store` to the `dashboard`. Handles authentication, authorization, and data aggregation for display.
*   **`apps/tracking-pixel`**: The JavaScript client-side library embedded on customer websites. Responsible for capturing `page_view` and custom events, UTM parameters, and sending them reliably to the `Edge / CDN Layer`.

### Services

*   **`services/ingestion-api`**: A high-throughput Go service. It receives events from the `Edge Worker`, performs immediate IP hashing, generates cookieless session IDs, validates basic event structure, and pushes raw events to the `Message Queue`.
*   **`services/event-transformer`**: A Go stream processing service. It consumes raw events from the `Message Queue`, normalizes their schema, enriches them with data like geo-location and device type, and publishes the enriched events to another `Message Queue` topic for the `Attribution Engine`.
*   **`services/attribution-engine`**: A Go stream processing service. It consumes enriched events, maintains anonymous session state, applies configured attribution models (First-Touch, Last-Touch, Time-Decay), computes aggregated metrics (e.g., funnels, conversion rates), and persists the results to the `Aggregated Metrics Store` and `Raw Event Store`.
*   **`services/edge-worker`**: A TypeScript application deployed to an Edge/CDN platform (e.g., Cloudflare Workers). It acts as the initial entry point for pixel events, performing rate limiting, basic validation, and forwarding events to the `Ingestion API`.
*   **`services/admin-service`**: (Future) A Go service providing internal administrative functionalities, such as managing projects, users, and implementing the configurable data retention and event deletion APIs.

### Packages (Internal Libraries)

*   **`packages/ui`**: A collection of reusable React components to ensure consistency across the `dashboard`.
*   **`packages/@platform/types`**: TypeScript interfaces and types for common data structures (events, API payloads, database records), shared across all TypeScript-based applications and services.
*   **`packages/@platform/go-sdk`**: A Go module containing shared Go types, common Kafka client wrappers, database client interfaces, and utility functions used by all Go services.
*   **`packages/@platform/eslint-config`**: Standardized ESLint configurations to enforce code style and quality across TypeScript/JavaScript projects.
*   **`packages/@platform/tsconfig`**: Reusable TypeScript configurations to ensure consistent compiler options.
*   **`packages/@platform/proto`**: Contains Protocol Buffer `.proto` definitions for event schemas and optionally for internal gRPC communication, along with generated client/server code.

### Infrastructure (IaC)

*   **`infra/kubernetes`**: Kubernetes YAML manifests for deploying services, configuring ingress, services, config maps, and secrets.
*   **`infra/helm`**: Helm charts for templating and managing Kubernetes deployments, including third-party components like Kafka, ClickHouse, and PostgreSQL.
*   **`infra/terraform`**: Terraform modules for provisioning core cloud infrastructure (VPC, Kubernetes clusters, managed databases, message queues).
*   **`infra/environments`**: Environment-specific Terraform configurations (e.g., `dev`, `staging`, `prod`).

---

## 4. Technology Stack

*   **Monorepo Tool:** Turborepo
*   **Backend Languages:** Go (primary for services), TypeScript/Node.js (for Query API)
*   **Frontend Language:** TypeScript
*   **Frontend Framework:** Next.js, React
*   **Edge Compute:** Cloudflare Workers (or Fastly Compute)
*   **Message Queue:** Apache Kafka (or NATS, Redis Streams)
*   **Raw Event Store:** ClickHouse (or Google BigQuery, Apache Druid)
*   **Aggregated Metrics Store:** PostgreSQL
*   **Container Orchestration:** Kubernetes
*   **Infrastructure as Code:** Terraform, Helm
*   **CI/CD:** GitHub Actions
*   **Observability:** Prometheus, Grafana, OpenTelemetry, Structured Logging
*   **Database ORMs/Clients:** `pgx` (Go), `TypeORM`/`Prisma` (Node.js), `go-clickhouse/clickhouse` (Go), `clickhouse-js` (Node.js)

---

## 5. Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (LTS recommended)
*   [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)
*   [Go](https://go.dev/) (version 1.21+)
*   [Docker](https://www.docker.com/)
*   [Docker Compose](https://docs.docker.com/compose/)
*   [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) (if working with Kubernetes locally)
*   [Helm](https://helm.sh/docs/intro/install/) (if working with Helm charts)
*   [Terraform](https://www.terraform.io/downloads.html) (if managing cloud infrastructure)
*   [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/) (for `edge-worker` development)

### Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-org/platform.git
    cd platform
    ```

2.  **Install root dependencies:**
    ```bash
    npm install # or yarn install
    ```
    This will install Turborepo and root-level dev dependencies.

3.  **Install workspace dependencies:**
    For Node.js/TypeScript workspaces:
    ```bash
    turbo run install # This will run npm install in each JS/TS workspace
    ```
    For Go workspaces, dependencies are managed by `go mod tidy` within each service.

4.  **Set up local infrastructure (Docker Compose):**
    A `docker-compose.yml` file in `scripts/local-infra/` can bring up Kafka, ClickHouse, and PostgreSQL.
    ```bash
    cd scripts/local-infra
    docker-compose up -d
    ```
    *Refer to `scripts/local-infra/README.md` for detailed local infrastructure setup.*

5.  **Configure environment variables:**
    Each service in `apps/` and `services/` has an `.env.example` file. Copy these to `.env` and fill in the necessary values for local development (e.g., database connection strings, Kafka broker addresses).

### Running Services

You can run individual services in development mode using Turborepo.

*   **Run all services in dev mode (parallel):**
    ```bash
    npm run dev
    ```
    This will start `dashboard`, `query-api`, and any other `dev` scripts defined in `turbo.json`.

*   **Run a specific service in dev mode:**
    ```bash
    turbo run dev --filter=dashboard
    turbo run dev --filter=query-api
    ```
    For Go services, you might use `go run main.go` or a specific script within the service directory if a `dev` script isn't defined in `package.json`.

    *   **Go services (e.g., `ingestion-api`):**
        ```bash
        cd services/ingestion-api
        go run main.go
        ```

### Building & Testing

*   **Build all workspaces:**
    ```bash
    npm run build
    ```

*   **Build a specific workspace:**
    ```bash
    turbo run build --filter=ingestion-api
    turbo run build --filter=dashboard
    ```

*   **Run tests for all workspaces:**
    ```bash
    npm run test
    ```

*   **Run tests for a specific workspace:**
    ```bash
    turbo run test --filter=query-api
    ```

*   **Run linting for all workspaces:**
    ```bash
    npm run lint
    ```

---

## 6. Deployment

Deployment is managed via Infrastructure as Code (IaC) using Terraform for cloud resources and Helm charts deployed to Kubernetes. GitHub Actions handle CI/CD, triggering deployments to `dev`, `staging`, and `prod` environments upon merging to respective branches.

*   **Kubernetes:** Services are containerized with Docker and deployed to Kubernetes clusters.
*   **Terraform:** Manages cloud infrastructure (VPCs, EKS/GKE clusters, managed databases).
*   **Helm:** Packages and deploys applications to Kubernetes, managing dependencies and configurations.

*Refer to the `infra/` directory for detailed deployment configurations and documentation.*

---

## 7. Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to submit pull requests, report issues, and contribute to the project.

---

## 8. Security & Privacy

This platform is built with a strong emphasis on security and privacy:

*   **TLS Everywhere:** All communications are encrypted.
*   **IP Hashing:** User IP addresses are hashed immediately upon ingestion; raw IPs are never stored.
*   **Cookieless Sessions:** Anonymous session IDs are generated without reliance on persistent cross-site identifiers.
*   **Configurable Data Retention:** Data retention policies are configurable at a project level.
*   **GDPR & CCPA Compliance:** Designed to align with major global privacy regulations.
*   **Role-Based Access Control (RBAC):** For dashboard and API access.
*   **Rate Limiting & Abuse Detection:** To protect against malicious activity.

For security concerns, please refer to our [SECURITY.md](SECURITY.md).

---

## 9. Support

For questions, issues, or feature requests, please open an issue on our [GitHub Issues](https://github.com/your-org/platform/issues) page.

---

## 10. License

This project is licensed under the [MIT License](LICENSE).

---