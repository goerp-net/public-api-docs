---
title: المنتجات
description: قراءة المنتجات على مستوى المتغير (SKU).
---

::api-endpoint{method="GET" path="/v1/public/products" scope="read_products"}
::

::api-endpoint{method="GET" path="/v1/public/products/{id}" scope="read_products"}
::

```json
{
  "sku": "TSHIRT-BLK-L",
  "name": "T-Shirt, Black, Large",
  "salesPrice": null,
  "active": true
}
```

::callout{type="warning"}
`salesPrice` موجود في **القائمة** لكن **null** في GET واحد حالياً. استخدم القائمة مع `sku`.
::
