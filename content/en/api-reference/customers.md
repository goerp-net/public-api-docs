---
title: Customers
description: Read customer records including contact details and addresses.
---

Scope: **`read_customers`**

::callout{type="warning"}
Returns **personal data**. Handle accordingly, store only what you need, and honour deletion requests from the tenant.
::

## List customers

::api-endpoint{method="GET" path="/v1/public/customers" scope="read_customers"}
::

| Parameter | Type | Notes |
|-----------|------|-------|
| `phone` | string | Exact match on primary number |
| `search` | string | Partial match on name, email, either phone, or code |
| `sortBy` | string | `createdAt`, `updatedAt`, `fullName` |

## Get one customer

::api-endpoint{method="GET" path="/v1/public/customers/{id}" scope="read_customers"}
::

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "code": "CUST-00042",
  "fullName": "Mona Ali",
  "email": "mona@example.com",
  "phone": "+201001234567",
  "phoneAlt": null,
  "governorate": "Giza",
  "city": "Giza",
  "region": "Dokki",
  "address": "12 Nile St, Apt 4",
  "active": true,
  "createdAt": "2026-07-19T09:00:00Z",
  "updatedAt": "2026-07-19T09:30:00Z"
}
```

**404** for a customer belonging to another tenant.
