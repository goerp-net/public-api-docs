---
title: Compatibility
description: Additive changes ship without notice; breaking changes use new version prefixes.
---

## Additive changes (no notice)

These may ship at any time without a version bump:

- New endpoints
- New optional request fields
- New response fields
- New enum values
- New scopes

**Parse leniently** — tolerate unknown enum values and extra response fields.

## Breaking changes (new version)

These go through a new version prefix (e.g. `/v2/public`):

- Removing or renaming a field
- Removing an enum value
- Tightening validation
- Changing a status code

`/v1/public` will not break under you.

## Enum handling

New enum values may be added over time for fields like `status`, `shippingStatus`, and `paymentStatus`. Treat unrecognised values as **unknown** rather than failing your integration.

## Known defects

| Issue | Status |
|-------|--------|
| Auth error `message` is raw i18n key | Fix pending — use `code` |
| 429 rate limit is plain text | Fix pending — check status first |
| `salesPrice` null on `GET /products/{id}` | Fix pending — use list + `sku` filter |
| `write_products` scope unused | Defined but no endpoints |
| Order update not exposed | Create and cancel only |

See the full list on the [Integration Checklist](/en/integration-checklist).
