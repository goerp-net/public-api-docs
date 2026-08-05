---
title: العملاء
description: قراءة سجلات العملاء وبيانات الاتصال.
---

::callout{type="warning"}
**بيانات شخصية** — خزّن ما تحتاج فقط واحترم طلبات الحذف.
::

::api-endpoint{method="GET" path="/v1/public/customers" scope="read_customers"}
::

::api-endpoint{method="GET" path="/v1/public/customers/{id}" scope="read_customers"}
::

```json
{
  "code": "CUST-00042",
  "fullName": "Mona Ali",
  "phone": "+201001234567",
  "governorate": "Giza",
  "city": "Giza",
  "address": "12 Nile St, Apt 4"
}
```
