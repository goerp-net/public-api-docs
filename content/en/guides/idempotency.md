---
title: Idempotency
description: Use externalOrderId to safely retry order creation without duplicates.
---

Supplying **`externalOrderId`** on order creation makes the request safe to retry. Repeating a request with a reference already used returns **200 OK** with the order created the first time, instead of **201 Created** with a second order.

Use it for anything you might retry — a timeout, network failure, or queue redelivery. Generate one reference per logical order and reuse it across attempts.

## Example

```json
{
  "externalOrderId": "webshop-98217",
  "customerName": "Mona Ali",
  "customerPhone": "+201001234567",
  "shippingGovernorate": "Giza",
  "shippingCity": "Giza",
  "shippingAddress": "12 Nile St, Apt 4",
  "lines": [
    { "sku": "TSHIRT-BLK-L", "quantity": 2 }
  ]
}
```

## Best-effort limitation

Two **concurrent** identical requests can both find nothing and both create an order, because uniqueness is not enforced at the database level.

**Serialise retries** for the same reference rather than firing them in parallel.
