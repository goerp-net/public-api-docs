---
title: Inventory
description: List warehouses and storage locations for order creation and stock interpretation.
---

Scope: **`read_inventory`**

## List warehouses

::api-endpoint{method="GET" path="/v1/public/warehouses" scope="read_inventory"}
::

Not paginated — returns all tenant warehouses.

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "name": "Cairo Main",
    "code": "CAI-01",
    "city": "Cairo",
    "active": true
  }
]
```

Use this to find the `warehouseId` required when order creation needs one (tenant with multiple active warehouses).

## List locations

::api-endpoint{method="GET" path="/v1/public/warehouses/{id}/locations" scope="read_inventory"}
::

Not paginated. **404** if the warehouse is not the tenant's.

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174003",
    "warehouseId": "123e4567-e89b-12d3-a456-426614174002",
    "name": "Aisle 3 / Shelf B",
    "code": "A3-B",
    "type": "INTERNAL",
    "pickable": true,
    "receivable": true,
    "active": true
  }
]
```

Location `type` values: `INTERNAL`, `EXTERNAL`, `STAGING`, `PICKING`, `RECEIVING`, `SHIPPING`, `QUARANTINE`, `RETURNS`, `VIRTUAL_VENDOR`, `VIRTUAL_CUSTOMER`, `VIRTUAL_ADJUSTMENT`, `VIRTUAL_TRANSIT`.

Locations mainly matter for interpreting `locationId` on stock rows.
