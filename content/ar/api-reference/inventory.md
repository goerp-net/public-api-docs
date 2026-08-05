---
title: المستودعات
description: قائمة المستودعات ومواقع التخزين.
---

::api-endpoint{method="GET" path="/v1/public/warehouses" scope="read_inventory"}
::

```json
[{ "id": "...", "name": "Cairo Main", "code": "CAI-01", "active": true }]
```

::api-endpoint{method="GET" path="/v1/public/warehouses/{id}/locations" scope="read_inventory"}
::

استخدم `warehouseId` عند إنشاء الطلب إذا كان للمستأجر أكثر من مستودع نشط.
