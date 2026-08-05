---
title: Ping
description: تحقق من مفتاح API والصلاحيات الممنوحة.
---

::api-endpoint{method="GET" path="/v1/public/ping" scope="read_orders"}
::

::api-endpoint{method="POST" path="/v1/public/ping" scope="write_orders"}
::

```json
{
  "tenantId": "...",
  "keyName": "Shipping integration",
  "grantedScopes": ["write_orders", "read_orders"],
  "serverTime": "2026-08-01T10:15:30Z"
}
```

`grantedScopes` بعد تطبيق الضمنيات — الإجابة النهائية على "ماذا يستطيع هذا المفتاح؟"

```bash
curl https://api.daqiqerp.com/api/v1/public/ping \
  -H "X-Api-Key: daqiq_live_your_key_here"
```
