---
title: Rate Limits
description: 120 requests per minute per API key with plain-text 429 responses.
---

## Request budget

**120 requests per minute per key**, refilled as a whole bucket each minute.

- The budget is shared across all `/v1/public/*` paths
- Reading products and creating orders draw on the same 120
- Limits are **per key, not per tenant** — one integration cannot exhaust another's allowance

## Exceeding the limit

Returns **HTTP 429** with:

```
Content-Type: text/plain

Too many requests. Please try again later.
```

::callout{type="warning"}
This response is **plain text**, not the JSON envelope every other error uses. Parse defensively — check the status code before attempting to read JSON.
::

There is **no `Retry-After` header**. Back off and retry after about a minute.

## Auth failure rate limiting

Repeated authentication failures from one IP are separately budgeted and will start returning 429 before they reach the database. This never affects a caller sending a valid key.

The 429 from auth failure rate limiting **does** use the JSON envelope with `code: "RATE_LIMIT_EXCEEDED"`.
