---
title: Stock
description: Query on-hand, reserved, and available quantity per variant per location.
---

Scope: **`read_stock`**

[Products](/en/api-reference/products) now include inline stock totals on list/get. Use `/stock` when you need a **per-warehouse, per-location** breakdown.

## List stock

::api-endpoint{method="GET" path="/v1/public/stock" scope="read_stock"}
::

Returns one row per variant per location. A variant in three locations produces three rows — sum them for a total.

| Parameter | Type | Notes |
|-----------|------|-------|
| `sku` | string | Unknown SKU → 404 |
| `productVariantId` | uuid | Alternative to `sku` |
| `warehouseId` | uuid | Restrict to one warehouse |
| `sortBy` | string | `createdAt`, `updatedAt` |

```json
{
  "productVariantId": "123e4567-e89b-12d3-a456-426614174001",
  "sku": "TSHIRT-BLK-L",
  "warehouseId": "123e4567-e89b-12d3-a456-426614174002",
  "locationId": "123e4567-e89b-12d3-a456-426614174003",
  "locationName": "Aisle 3 / Shelf B",
  "quantityOnHand": 40,
  "reservedQuantity": 6,
  "availableQuantity": 34,
  "lastMovementAt": "2026-07-19T09:30:00Z"
}
```

**`availableQuantity`** = `quantityOnHand - reservedQuantity` — the number to check before promising stock, not `quantityOnHand`.

An unknown `sku` filter returns **404** rather than silently ignoring the filter.
