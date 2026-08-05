---
title: الصلاحيات (Scopes)
description: كل مفتاح يحمل صلاحيات؛ كل نقطة نهاية تتطلب صلاحية. النقص يُرجع 403.
---

| الصلاحية | تمنح | تتضمن ضمنياً |
|----------|------|--------------|
| `read_orders` | عرض الطلبات | — |
| `write_orders` | إنشاء الطلبات | `read_orders` |
| `cancel_orders` | إلغاء الطلبات | `read_orders` |
| `read_products` | قراءة المنتجات | — |
| `read_stock` | قراءة المخزون | — |
| `read_inventory` | قراءة المستودعات | — |
| `read_customers` | قراءة العملاء | — |
| `write_products` | *(محجوز — لا نقاط بعد)* | `read_products` |

## ملاحظات مهمة

- **`cancel_orders` لا تتضمنها `write_orders`** — الإنشاء والإلغاء مستويان مختلفان من الثقة
- **`read_customers` تكشف بيانات شخصية** — امنحها فقط للتكاملات التي تحتاجها
- **`write_products` غير مستخدمة حالياً**

استدعِ `GET /v1/public/ping` لرؤية `grantedScopes` بعد تطبيق الضمنيات.
