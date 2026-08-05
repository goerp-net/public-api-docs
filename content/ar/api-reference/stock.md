---
title: المخزون
description: الكمية المتاحة والمحجوزة لكل متغير وموقع.
---

::api-endpoint{method="GET" path="/v1/public/stock" scope="read_stock"}
::

```json
{
  "sku": "TSHIRT-BLK-L",
  "quantityOnHand": 40,
  "reservedQuantity": 6,
  "availableQuantity": 34
}
```

**`availableQuantity`** = المتاح للبيع. SKU غير معروف → **404**.
