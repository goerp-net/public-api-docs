---
title: Errors
description: Every error returns a stable code, localized message, and optional traceParent for support.
---

Every error uses the same JSON envelope, except **HTTP 429 from the request rate limit**, which returns plain text — see [Rate Limits](/en/guides/rate-limits).

## Error envelope

```json
{
  "code": "API_KEY_EXPIRED",
  "message": "This API key has expired.",
  "errorDetails": "No product found with SKU: NOPE",
  "traceParent": "00-6a6ddf1d5144f16d79383143e0ea9b93-4c464f444c6a5413-00",
  "timestamp": "2026-08-01T11:57:17.698Z"
}
```

| Field | Notes |
|-------|-------|
| `code` | Stable identifier — **branch on this**, never on `message` |
| `message` | Human-readable, localized via `Accept-Language` (`en` and `ar` supported) |
| `errorDetails` | Specific cause when applicable — offending SKU, field at fault |
| `traceParent` | Log this and quote it in support requests |

## Error codes

| HTTP | Code | Meaning |
|------|------|---------|
| 401 | `API_KEY_MISSING` | No `X-Api-Key` header |
| 401 | `API_KEY_INVALID` | Unrecognised or malformed key |
| 401 | `API_KEY_DISABLED` | Key exists but has been disabled |
| 401 | `API_KEY_EXPIRED` | Key is past its `expiresAt` |
| 403 | `ACCESS_DENIED` | Key lacks required scope, or record belongs to another tenant |
| 400 | `INVALID_REQUEST` | Bad parameter, unknown SKU, unpriced product |
| 400 | `VALIDATION_ERROR` | Body failed validation; see `fieldErrors` |
| 404 | `ENTITY_NOT_FOUND` | No such record for this tenant |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests (JSON envelope variant) |

::callout{type="warning"}
Authentication failures (`API_KEY_*` codes) currently render `message` as a raw i18n key (e.g. `error.apiKey.invalid`) rather than a sentence. `code` is correct and stable. Do not surface `message` to end users for 401s until this is fixed.
::

## Cross-tenant access

A record belonging to another tenant returns **403 or 404** depending on the resource — never the record itself. Do not treat 403 and 404 as distinguishable evidence about whether an ID exists.
