---
title: Integration Checklist
description: Best practices for building a reliable Daqiq public API integration.
---

## Before you go live

1. **Store the key as a secret** — environment variable or secret manager; never in source control or a browser
2. **Confirm with `/v1/public/ping`** — cheapest way to distinguish a bad key from a bad request
3. **Branch on `code`, not `message`** — messages are localized and may be reworded
4. **Use `externalOrderId` on every create** — and serialise retries for the same reference
5. **Handle 429 with back-off** — not a tight retry loop
6. **Check `availableQuantity` before promising stock** — creation does not reserve it
7. **Don't page past 10,000** — use the [time-window walk](/en/guides/pagination) for bulk reads
8. **Log `traceParent` on every failure** — quote it in support requests
9. **Tolerate new enum values and new response fields** — both may be added without a version bump

## Compatibility policy

**Additive changes** ship without notice: new endpoints, optional request fields, new response fields, new enum values, new scopes. Parse leniently.

**Breaking changes** — removing or renaming a field, removing an enum value, tightening validation, changing a status code — go through a new version prefix. `/v1/public` will not break under you.

## Known limitations

| Limitation | Workaround |
|------------|------------|
| Auth error `message` is a raw i18n key | Use `code`. Fix pending. |
| 429 from rate limit is plain text, not JSON | Check status before parsing. Fix pending. |
| Idempotency is best-effort | Serialise retries; no parallel identical creates |
| No `Retry-After` on 429 | Back off ~1 minute |
| Paging capped at 10,000 | Use time-window walk. Cursors planned. |
| `salesPrice` is null on `GET /products/{id}` | Use list endpoint filtered by `sku`. Fix pending. |
| `write_products` grants nothing | Defined but unused |
| Order update is not exposed | Create and cancel only |
| `lastUsedAt` is up to 5 minutes stale | By design |
