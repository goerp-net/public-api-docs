---
title: Products
description: Read the product catalogue at variant level — SKUs, barcodes, and retail prices.
---

Products are published at **variant level** — a variant carries the SKU that order lines refer to.

Scope: **`read_products`**

## List products

::api-endpoint{method="GET" path="/v1/public/products" scope="read_products"}
::

| Parameter | Type | Notes |
|-----------|------|-------|
| `sku` | string | Exact match |
| `search` | string | Partial match on name, SKU, or barcode |
| `active` | boolean | Omit for both |
| `sortBy` | string | `createdAt`, `updatedAt`, `sku`, `name` |

## Get one product

::api-endpoint{method="GET" path="/v1/public/products/{id}" scope="read_products"}
::

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "sku": "TSHIRT-BLK-L",
  "barcode": "6221031492018",
  "name": "T-Shirt, Black, Large",
  "productName": "T-Shirt",
  "unitOfMeasure": "Piece",
  "salesPrice": null,
  "active": true,
  "imageUrl": "https://cdn.example.com/tshirt-black.jpg",
  "createdAt": "2026-07-19T09:00:00Z",
  "updatedAt": "2026-07-19T09:30:00Z"
}
```

`salesPrice` is the retail price an order line will use. Cost price is **never** exposed.

::callout{type="warning"}
`salesPrice` is populated on the **list** endpoint but is currently always **null** on `GET /v1/public/products/{id}`. Read prices from the list endpoint — filter by `sku` for a single row — until this is fixed.
::
