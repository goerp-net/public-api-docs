---
title: Authentication
description: Authenticate every public API request with the X-Api-Key header.
---

Send your API key in the **`X-Api-Key`** header on every request:

```bash
curl https://api.daqiqerp.com/api/v1/public/orders \
  -H "X-Api-Key: daqiq_live_x8s0Ff2kQ1mZ7pR4tYvB9nL6wA3sD5gH8jK2xC0vN1q"
```

## Not Bearer tokens

Do **not** use `Authorization: Bearer` — that header is for user sessions and is ignored on public endpoints.

## Tenant scoping

The key identifies the tenant. You cannot specify a tenant in any request. Every read is scoped to the key's tenant and every write is attributed to it. There is no combination of parameters that reaches another tenant's data.

## Separate security chain

`/v1/public/**` is served by a separate security chain from the rest of the application:

- An API key **cannot** authenticate a non-public endpoint
- A user JWT **cannot** authenticate a public endpoint

## Store keys securely

Treat the key as a bearer credential with no second factor:

- Environment variable or secret manager
- **Never** in source control
- **Never** in a browser

## Verify credentials

Use the [Ping](/en/api-reference/ping) endpoint to confirm your key works and see granted scopes before building real integrations.
