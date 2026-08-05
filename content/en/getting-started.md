---
title: Overview
description: Partner-facing HTTP API for integrating with Daqiq ERP using tenant-issued API keys.
---

The Daqiq Public API is a partner-facing HTTP API authenticated with **tenant-issued API keys**. Use it to sync orders, products, stock, inventory, and customers with external systems.

## Base URLs

| Environment | Base URL |
|-------------|----------|
| Production | `https://api.daqiqerp.com/api` |
| Development | `https://api-dev.goerp.net/api` |
| Local | `http://localhost:8080/api` |

The `/api` context path is part of the URL. Every path in this documentation is relative to the base URL. For example, `/v1/public/orders` resolves to:

```
https://api.daqiqerp.com/api/v1/public/orders
```

## Interactive reference

Open [Swagger UI](https://api.daqiqerp.com/api/swagger-ui/index.html) for an interactive reference. Public endpoints are tagged **Public API - *** and use the **ApiKey** security scheme. Click **Authorize**, paste your key into the ApiKey box, and the `X-Api-Key` header is sent for you.

A development environment is also available at `https://api-dev.goerp.net/api`.

## Getting an API key

API keys are created in the Daqiq dashboard:

**Settings → مفاتيح API (API Keys)** in [Daqiq](https://app.daqiqerp.com)

Only tenant administrators can manage keys. Keys look like:

```
daqiq_live_x8s0Ff2kQ1mZ7pR4tYvB9nL6wA3sD5gH8jK2xC0vN1q
└─ prefix ─┘└──────────── 43 random base64url chars ────────────┘
```

The plaintext key is shown **exactly once** when created. Store it securely — if lost, delete the key and create a new one.

## What's in this documentation

This site covers **Part 2 — Using the public API** for partner developers. It does not document internal key-management endpoints used by the dashboard.

::callout{type="info"}
Before wiring up real integrations, call `GET /v1/public/ping` to confirm your key and granted scopes.
::
