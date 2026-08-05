---
title: Idempotency
description: استخدم externalOrderId لإعادة محاولة إنشاء الطلب بأمان.
---

**`externalOrderId`** يجعل الطلب آمناً لإعادة المحاولة. تكرار نفس المرجع يُرجع **200** مع الطلب الأصلي بدلاً من **201** بطلب ثانٍ.

```json
{
  "externalOrderId": "webshop-98217",
  "customerName": "Mona Ali",
  "lines": [{ "sku": "TSHIRT-BLK-L", "quantity": 2 }]
}
```

## قيد

طلبان **متزامنان** متطابقان قد ينشئان طلبين — **سلسل إعادة المحاولات** ولا تشغّلها بالتوازي.
