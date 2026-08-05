---
title: الأخطاء
description: كل خطأ يُرجع code ثابت ورسالة مترجمة وtraceParent اختياري.
---

```json
{
  "code": "API_KEY_EXPIRED",
  "message": "This API key has expired.",
  "errorDetails": "No product found with SKU: NOPE",
  "traceParent": "00-6a6ddf1d5144f16d79383143e0ea9b93-4c464f444c6a5413-00",
  "timestamp": "2026-08-01T11:57:17.698Z"
}
```

| HTTP | Code | المعنى |
|------|------|--------|
| 401 | `API_KEY_MISSING` | لا ترويسة X-Api-Key |
| 401 | `API_KEY_INVALID` | مفتاح غير معروف |
| 401 | `API_KEY_DISABLED` | المفتاح معطّل |
| 401 | `API_KEY_EXPIRED` | المفتاح منتهٍ |
| 403 | `ACCESS_DENIED` | صلاحية ناقصة أو سجل مستأجر آخر |
| 400 | `INVALID_REQUEST` | معامل خاطئ |
| 400 | `VALIDATION_ERROR` | فشل التحقق |
| 404 | `ENTITY_NOT_FOUND` | لا سجل |
| 429 | `RATE_LIMIT_EXCEEDED` | طلبات كثيرة |

**اعتمد على `code` وليس `message`.** الرسائل مترجمة عبر `Accept-Language` (`en` و `ar`).

::callout{type="warning"}
أخطاء المصادقة (`API_KEY_*`) تعرض حالياً `message` كمفتاح i18n خام. لا تعرضها للمستخدم النهائي في 401.
::

راجع [حدود المعدل](/ar/guides/rate-limits) — 429 من حد الطلبات يُرجع **نصاً عادياً** وليس JSON.
