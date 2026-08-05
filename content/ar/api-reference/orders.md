---
title: الطلبات
description: عرض وإنشاء وإلغاء طلبات المبيعات.
---

## قائمة الطلبات

::api-endpoint{method="GET" path="/v1/public/orders" scope="read_orders"}
::

| المعامل | النوع | ملاحظات |
|---------|-------|---------|
| `status` | enum | `NEW`, `CONFIRMED`, `CANCELLED`, ... |
| `orderType` | enum | `SALES`, `RETURN`, `EXCHANGE` |
| `createdAfter` | instant | شامل |
| `createdBefore` | instant | شامل |
| `sortBy` | string | `createdAt`, `updatedAt`, `orderDate`, `amountTotal` |

## طلب واحد

::api-endpoint{method="GET" path="/v1/public/orders/{id}" scope="read_orders"}
::

## إنشاء طلب

::api-endpoint{method="POST" path="/v1/public/orders" scope="write_orders"}
::

```json
{
  "externalOrderId": "webshop-98217",
  "customerName": "Mona Ali",
  "customerPhone": "+201001234567",
  "shippingGovernorate": "Giza",
  "shippingCity": "Giza",
  "shippingAddress": "12 Nile St, Apt 4",
  "lines": [{ "sku": "TSHIRT-BLK-L", "quantity": 2 }]
}
```

- **لا يمكن تحديد الأسعار** — تأتي من قائمة الأسعار
- **لا حجز مخزون** عند الإنشاء — راجع `/v1/public/stock`
- [Idempotency](/ar/guides/idempotency) لـ `externalOrderId`

## إلغاء

::api-endpoint{method="POST" path="/v1/public/orders/{id}/cancel" scope="cancel_orders"}
::

يتطلب **`cancel_orders`** — ليس ضمن `write_orders`.
