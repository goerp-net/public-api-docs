---
title: Pagination
description: Offset pagination with a 10,000 result cap and time-window walk for bulk reads.
---

List endpoints accept `page` and `pageSize` and return:

```json
{
  "data": [],
  "page": 0,
  "pageSize": 20,
  "totalItems": 137,
  "totalPages": 7
}
```

## Parameters

| Parameter | Default | Limit |
|-----------|---------|-------|
| `page` | 0 | Zero-based |
| `pageSize` | 20 | Max 500 |
| `sortBy` | `createdAt` | Per-resource whitelist |
| `sortDirection` | `desc` | `asc` or `desc` |

Sorting by a field the endpoint does not publish returns **400**, with the supported list in the message.

## The 10,000 result limit

`page × pageSize` may not exceed **10,000**. Beyond that:

```json
{
  "code": "INVALID_REQUEST",
  "message": "Cannot page beyond 10000 results (page 21 x pageSize 500 = 10500). Narrow the query and page within it."
}
```

Offset paging makes the database walk and discard every preceding row, and rows shift between requests as records are created — deep paging is both slow and lossy.

## Time-window walk

To read more than 10,000 records, walk forward by time instead of by page:

```bash
# Round 1
GET /v1/public/orders?sortBy=createdAt&sortDirection=asc&pageSize=500
# → 500 orders; note the last createdAt

# Round 2
GET /v1/public/orders?sortBy=createdAt&sortDirection=asc&pageSize=500
    &createdAfter=2026-01-04T11:22:33Z
# → next 500

# Repeat until a response returns fewer than pageSize
```

Every request sits at offset 0, so this stays fast at any depth. 100,000 orders ≈ 200 requests (~2 minutes at the rate limit).

### Caveats

- `createdAfter` is **inclusive** — records sharing the boundary timestamp reappear; deduplicate by `id`
- If more than `pageSize` records share one exact timestamp, the window cannot advance — use a larger `pageSize`

Cursor-based pagination is planned and will remove this limit.
