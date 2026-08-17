---
title: Products
description: Read the product catalogue with nested variants, inline stock, and retail prices.
---

Scope: **`read_products`**

A **product** is the container; a **variant** is what you sell. Order lines and stock refer to **variants**, not products.

```
Product  "T-Shirt"              ← name, description, images, product SKU
 ├── Variant "Black / Large"   ← order lines use variants[].id or variants[].sku
 └── Variant "Black / Small"
```

Every product has at least one variant in `variants[]` — including single-option products. There is no separate "simple product" shape.

::callout{type="warning"}
**Order lines use variant ids/SKUs, never the product id or product SKU.** Sending the product's own `id` or `sku` to `POST /v1/public/orders` returns **404 `ENTITY_NOT_FOUND`**. The same applies to `/v1/public/stock`.
::

## List products

::api-endpoint{method="GET" path="/v1/public/products" scope="read_products"}
::

### Query parameters

| Parameter | Type | Default | Notes |
|-----------|------|---------|-------|
| `sku` | string | — | Exact match. Accepts a **product SKU or variant SKU**. Returns at most one product. Unknown SKU → **empty page**, not 404. |
| `search` | string | — | Partial, case-insensitive match on product **name**, **description**, or **sku**. Does **not** search variant SKUs or barcodes — use `sku` for those. |
| `active` | boolean | both | Filters products. See [active caveat](#active-and-sellable-variants) below. |
| `page` | int | `0` | Zero-based |
| `pageSize` | int | `20` | Max 500 |
| `sortBy` | string | `createdAt` | `createdAt`, `updatedAt`, `sku`, `name` — product fields |
| `sortDirection` | string | `desc` | `asc` or `desc` |

`page × pageSize` may not exceed **10,000** (`400 INVALID_REQUEST`).

### Response

Standard page envelope — `data[]` contains **products**:

```json
{
  "data": [ /* products, see Response shape */ ],
  "page": 0,
  "pageSize": 20,
  "totalItems": 137,
  "totalPages": 7
}
```

`totalItems` counts **products**, not variants. A catalogue that showed 400 rows before may show 150 now.

## Get one product

::api-endpoint{method="GET" path="/v1/public/products/{id}" scope="read_products"}
::

`{id}` is the **product id**. Returns one product in the same shape as a list entry.

| HTTP | Code | When |
|------|------|------|
| 200 | — | Found |
| 403 | `ACCESS_DENIED` | Key lacks `read_products` |
| 404 | `ENTITY_NOT_FOUND` | Unknown product id, **variant id passed by mistake**, or another tenant's product |

If you only have a variant id, there is no direct lookup — keep the product id from a listing, or use `GET /products?sku=<variant-sku>`.

## Response shape

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "sku": "TSHIRT",
  "barcode": "6221031492001",
  "name": "T-Shirt",
  "description": "Ringspun cotton, pre-shrunk",
  "costPrice": 70.00,
  "salesPrice": 189.00,
  "active": true,
  "quantityOnHand": 62,
  "reservedQuantity": 9,
  "availableQuantity": 53,
  "inStock": true,
  "imageUrl": "https://cdn.example.com/tshirt.jpg",
  "imageUrls": [
    "https://cdn.example.com/tshirt.jpg",
    "https://cdn.example.com/tshirt-back.jpg"
  ],
  "createdAt": "2026-07-19T09:00:00Z",
  "updatedAt": "2026-07-19T09:30:00Z",
  "variants": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "sku": "TSHIRT-BLK-L",
      "barcode": "6221031492018",
      "name": "T-Shirt, Black, Large",
      "unitOfMeasure": "Piece",
      "costPrice": 80.00,
      "salesPrice": 199.00,
      "active": true,
      "quantityOnHand": 40,
      "reservedQuantity": 6,
      "availableQuantity": 34,
      "inStock": true,
      "imageUrl": "https://cdn.example.com/tshirt-black.jpg",
      "imageUrls": ["https://cdn.example.com/tshirt-black.jpg"],
      "createdAt": "2026-07-19T09:00:00Z",
      "updatedAt": "2026-07-19T09:30:00Z"
    }
  ]
}
```

Variants are ordered by the tenant's display order, then SKU. Render them in the order received.

### Product fields

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| `id` | uuid | no | Product id. **Not orderable.** |
| `sku` | string | no | Product SKU. Distinct from variant SKUs. |
| `barcode` | string | yes | |
| `name` | string | no | Replaces the old `productName`. |
| `description` | string | yes | Free text. Escape before rendering — not HTML-sanitised. |
| `costPrice` | decimal | yes | Confidential — see [costPrice](#costprice-is-confidential). |
| `salesPrice` | decimal | yes | Retail price. `null` when none configured. |
| `active` | boolean | no | See [active caveat](#active-and-sellable-variants). |
| `quantityOnHand` | decimal | no | Summed across variants and warehouses. |
| `reservedQuantity` | decimal | no | Summed across variants. |
| `availableQuantity` | decimal | no | `quantityOnHand - reservedQuantity`. Can be negative. |
| `inStock` | boolean | no | `true` when **at least one variant** has stock free — not `availableQuantity > 0`. |
| `imageUrl` | string | yes | Main image. |
| `imageUrls` | string[] | no | Always present; may be `[]`. Main image first, deduplicated. |
| `createdAt` | instant | no | UTC ISO-8601 |
| `updatedAt` | instant | no | |
| `variants` | array | no | Always present; at least one entry in practice. |

### Variant fields

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| `id` | uuid | no | **Use this on order lines.** |
| `sku` | string | no | Unique per tenant. Accepted by orders and `/stock?sku=`. |
| `barcode` | string | yes | Unique per tenant when set. |
| `name` | string | yes | Often `null` on single-variant products — fall back to product `name`. |
| `unitOfMeasure` | string | yes | e.g. `Piece`, `Box`. |
| `costPrice` | decimal | no | Confidential. |
| `salesPrice` | decimal | yes | Price used when ordering. `null` → order create returns **400**. |
| `active` | boolean | no | |
| `quantityOnHand` | decimal | no | Across all warehouses. |
| `reservedQuantity` | decimal | no | |
| `availableQuantity` | decimal | no | Decide against this. Can be negative. |
| `inStock` | boolean | no | `availableQuantity > 0`. |
| `imageUrl` | string | yes | Does **not** fall back to product image. |
| `imageUrls` | string[] | no | Always present; may be `[]`. |
| `createdAt` | instant | no | |
| `updatedAt` | instant | no | |

## Active and sellable variants

`active` on the product means **any variant is active** — an `active=true` product can still contain inactive variants. For a buyable list, filter variants yourself:

```js
const sellable = product.variants.filter(
  v => v.active && v.salesPrice != null && v.inStock,
)
```

Product and variant `salesPrice` values are **independent** — do not fall back from one to the other. Show the variant's price on the variant.

## Inline stock

Stock totals are included on list and get responses — you no longer need a companion `/stock` call for catalogue screens.

| Field | Meaning |
|-------|---------|
| `quantityOnHand` | Units physically held |
| `reservedQuantity` | Units committed to other orders |
| `availableQuantity` | On-hand minus reserved — **decide against this** |
| `inStock` | Whether anything is free to sell |

All four are always present (default `0` / `false`).

- **Clamp for display:** `Math.max(0, variant.availableQuantity)` — negative values are valid (over-reserved).
- **Product `inStock`** ≠ `product.availableQuantity > 0`. Use product `inStock` for "show this product"; use each variant's `availableQuantity` for "can I sell this one".
- Totals are **summed across all warehouses**. For per-location breakdown, use [Stock](/en/api-reference/stock) (`read_stock`).
- Stock is a **snapshot** — orders do not reserve at creation. See [Orders](/en/api-reference/orders).

## costPrice is confidential

`costPrice` is what the tenant pays for the item. Do **not** show it on customer-facing surfaces — admin and reconciliation only.

## Examples

### List the first page

```bash
curl -H "X-Api-Key: daqiq_live_your_key" \
  "https://api.daqiqerp.com/api/v1/public/products?page=0&pageSize=20&sortBy=name&sortDirection=asc"
```

### Look up by SKU (product or variant)

```bash
curl -H "X-Api-Key: daqiq_live_your_key" \
  "https://api.daqiqerp.com/api/v1/public/products?sku=TSHIRT-BLK-L"
```

When the SKU matched a variant, the full product returns with all variants — find yours by `variants[].sku`.

### Create an order from a variant

```json
{
  "customerName": "Mona Ali",
  "customerPhone": "+201001234567",
  "shippingGovernorate": "Giza",
  "shippingCity": "Dokki",
  "shippingAddress": "12 Tahrir St",
  "lines": [
    { "sku": "TSHIRT-BLK-L", "quantity": 2 }
  ]
}
```

Use the **variant** `sku` or `productVariantId` — not `product.sku`.

## Errors

Standard JSON error envelope. Branch on `code`.

| HTTP | Code | When |
|------|------|------|
| 400 | `INVALID_REQUEST` | Unsupported `sortBy`, or `page × pageSize` over 10,000 |
| 401 | `API_KEY_*` | See [Authentication](/en/authentication) |
| 403 | `ACCESS_DENIED` | Key lacks `read_products` |
| 404 | `ENTITY_NOT_FOUND` | `GET /{id}` with unknown product id, variant id, or another tenant's product |
| 429 | — | Rate limit. Plain text — check status before parsing JSON. |

An unknown `sku` on the **list** endpoint is **not** an error — it returns an empty page.

## Migration checklist

If you integrated against the old variant-flat shape:

1. Treat `data[]` entries as **products** with nested `variants[]`.
2. Use `variants[i].id` / `variants[i].sku` for orders and stock — never the product's.
3. `GET /products/{id}` now takes a **product id**.
4. Replace `productName` with `name`; move `unitOfMeasure` to variants.
5. Add a variant selector for multi-variant products; auto-select `variants[0]` for single-variant products.
6. Filter variants by `active` yourself for sellable lists.
7. Handle `salesPrice: null` at both levels.
8. Drop companion `/stock` calls from listing screens; keep `/stock` for per-location detail.
9. Gate `costPrice` behind admin surfaces only.
10. Re-check copy driven by `totalItems` — it now counts products.
