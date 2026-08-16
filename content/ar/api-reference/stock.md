---
title: المخزون
description: الكمية المتاحة والمحجوزة لكل متغير وموقع.
---

[المنتجات](/ar/api-reference/products) تتضمن مجاميع مخزون مدمجة. استخدم `/stock` للتفصيل **حسب المستودع والموقع**.

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
