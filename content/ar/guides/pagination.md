---
title: ترقيم الصفحات
description: ترقيم offset مع حد 10,000 ومشي زمني للقراءة الكبيرة.
---

```json
{
  "data": [],
  "page": 0,
  "pageSize": 20,
  "totalItems": 137,
  "totalPages": 7
}
```

| المعامل | الافتراضي | الحد |
|---------|-----------|------|
| `page` | 0 | يبدأ من 0 |
| `pageSize` | 20 | حد أقصى 500 |

## حد 10,000

`page × pageSize` لا يتجاوز **10,000**.

## المشي الزمني

```bash
GET /v1/public/orders?sortBy=createdAt&sortDirection=asc&pageSize=500
GET /v1/public/orders?...&createdAfter=2026-01-04T11:22:33Z
```

- `createdAfter` **شامل** — أزل التكرار بـ `id`
- كرر حتى تُرجع أقل من `pageSize`

ترقيم cursor مخطط له لاحقاً.
