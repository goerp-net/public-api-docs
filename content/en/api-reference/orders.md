---
title: Orders
description: List, read, create, and cancel sales orders via the public API.
---

## List orders

::api-endpoint{method="GET" path="/v1/public/orders" scope="read_orders"}
::

### Query parameters

| Parameter | Type | Notes |
|-----------|------|-------|
| `status` | enum | `NEW`, `CONFIRMED`, `CANCELLED`, `RESCHEDULED`, `RETURN_REQUESTED` |
| `orderType` | enum | `SALES`, `RETURN`, `EXCHANGE` |
| `createdAfter` | instant | Inclusive |
| `createdBefore` | instant | Inclusive |
| `sortBy` | string | `createdAt`, `updatedAt`, `orderDate`, `amountTotal` |
| `page` | number | Zero-based, default 0 |
| `pageSize` | number | Default 20, max 500 |

An inverted date range (`createdAfter` later than `createdBefore`) returns **400** rather than an empty page.

Orders hidden by the tenant's subscription state are never returned.

## Get one order

::api-endpoint{method="GET" path="/v1/public/orders/{id}" scope="read_orders"}
::

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "orderNumber": "SO/2026/00042",
  "orderType": "SALES",
  "status": "CONFIRMED",
  "shippingStatus": "NOT_SHIPPED",
  "paymentStatus": "PENDING",
  "customerName": "Mona Ali",
  "customerPhone": "+201001234567",
  "shippingAddress": "12 Nile St, Apt 4",
  "shippingCity": "Giza",
  "shippingGovernorate": "Giza",
  "trackingNumber": null,
  "orderDate": "2026-07-19",
  "amountUntaxed": 378.00,
  "amountTax": 52.92,
  "amountTotal": 460.92,
  "shippingCost": 30.00,
  "lines": [
    {
      "id": "...",
      "productVariantId": "...",
      "sku": "TSHIRT-BLK-L",
      "name": "T-Shirt, Black, Large",
      "quantity": 2,
      "unitPrice": 199.00,
      "discount": 20.00,
      "subtotal": 378.00
    }
  ],
  "createdAt": "2026-07-19T09:00:00Z",
  "updatedAt": "2026-07-19T09:30:00Z"
}
```

## Create order

::api-endpoint{method="POST" path="/v1/public/orders" scope="write_orders"}
::

```json
{
  "externalOrderId": "webshop-98217",
  "customerName": "Mona Ali",
  "customerPhone": "+201001234567",
  "shippingGovernorate": "Giza",
  "shippingCity": "Giza",
  "shippingRegion": "Dokki",
  "shippingAddress": "12 Nile St, Apt 4",
  "orderDate": "2026-08-01",
  "paymentMethod": "CASH_ON_DELIVERY",
  "warehouseId": null,
  "notes": "Ring the bell twice",
  "lines": [
    { "sku": "TSHIRT-BLK-L", "quantity": 2, "discount": 0, "isFixedDiscount": false }
  ]
}
```

### Required fields

| Field | Notes |
|-------|-------|
| `customerName`, `customerPhone` | Required |
| `shippingGovernorate`, `shippingCity`, `shippingAddress` | Required |
| `lines` | At least one line with **variant** `sku` **or** `productVariantId` — not the product SKU |
| `warehouseId` | Required when tenant has more than one active warehouse |

You **cannot set prices** — unit prices come from the tenant's retail price list. Returns **201 Created** with the full order.

See [Idempotency](/en/guides/idempotency) for `externalOrderId` retry behaviour.

### Stock note

Orders do **not** reserve stock at creation. Product list/get responses include inline stock totals — use `variants[].availableQuantity` when deciding what to sell. For per-warehouse detail, call `/v1/public/stock`.

### Over-quota orders

If the tenant is over its subscription limit, the order is still created (201) but **hidden** from list/get endpoints (404). Check the tenant's subscription if a created order vanishes.

## Cancel order

::api-endpoint{method="POST" path="/v1/public/orders/{id}/cancel" scope="cancel_orders"}
::

Requires **`cancel_orders`** — not granted by `write_orders`.

Optional body:

```json
{ "reason": "Customer changed their mind" }
```

Returns **200 OK** with `status: "CANCELLED"`. Cancellable only while `shippingStatus` is `NOT_SHIPPED` or `SENT_TO_SHIPPING_INTEGRATION`.
