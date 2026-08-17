---
title: المنتجات
description: قراءة المنتجات مع المتغيرات المتداخلة والمخزون المدمج وأسعار التجزئة.
---

النطاق: **`read_products`**

**المنتج** هو الحاوية؛ **المتغير** هو ما تبيعه. بنود الطلب والمخزون تشير إلى **المتغيرات**، لا إلى المنتج.

```
منتج  "T-Shirt"              ← الاسم، الوصف، الصور، SKU المنتج
 ├── متغير "Black / Large"   ← بنود الطلب تستخدم variants[].id أو variants[].sku
 └── متغير "Black / Small"
```

كل منتج يحتوي على متغير واحد على الأقل في `variants[]` — بما في ذلك المنتجات ذات خيار واحد.

::callout{type="warning"}
**بنود الطلب تستخدم معرف/SKU المتغير، وليس معرف أو SKU المنتج.** إرسال `id` أو `sku` الخاص بالمنتج إلى `POST /v1/public/orders` يُرجع **404 `ENTITY_NOT_FOUND`**. ينطبق ذلك أيضاً على `/v1/public/stock`.
::

## قائمة المنتجات

::api-endpoint{method="GET" path="/v1/public/products" scope="read_products"}
::

| المعامل | النوع | الافتراضي | ملاحظات |
|---------|-------|-----------|---------|
| `sku` | string | — | تطابق تام. SKU المنتج **أو** المتغير. SKU غير معروف → صفحة فارغة، ليس 404. |
| `search` | string | — | بحث جزئي في **اسم** المنتج، **الوصف**، **sku**. لا يبحث في SKU/barcode المتغيرات — استخدم `sku`. |
| `active` | boolean | كلاهما | انظر [ملاحظة active](#active-والمتغيرات-القابلة-للبيع) |
| `page` | int | `0` | يبدأ من صفر |
| `pageSize` | int | `20` | حد أقصى 500 |
| `sortBy` | string | `createdAt` | `createdAt`، `updatedAt`، `sku`، `name` |
| `sortDirection` | string | `desc` | `asc` أو `desc` |

`page × pageSize` لا يتجاوز **10,000** (`400 INVALID_REQUEST`).

## منتج واحد

::api-endpoint{method="GET" path="/v1/public/products/{id}" scope="read_products"}
::

`{id}` هو **معرف المنتج**. تمرير معرف متغير → **404**.

## شكل الاستجابة

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "sku": "TSHIRT",
  "name": "T-Shirt",
  "description": "Ringspun cotton, pre-shrunk",
  "costPrice": 70.00,
  "salesPrice": 189.00,
  "active": true,
  "quantityOnHand": 62,
  "reservedQuantity": 9,
  "availableQuantity": 53,
  "inStock": true,
  "imageUrl": "https://cdn.example.com/tshirt.jpg",
  "imageUrls": ["https://cdn.example.com/tshirt.jpg"],
  "variants": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "sku": "TSHIRT-BLK-L",
      "name": "T-Shirt, Black, Large",
      "unitOfMeasure": "Piece",
      "salesPrice": 199.00,
      "availableQuantity": 34,
      "inStock": true
    }
  ]
}
```

### حقول المنتج

| الحقل | ملاحظات |
|-------|---------|
| `id` | معرف المنتج — **غير قابل للطلب** |
| `name` | يحل محل `productName` القديم |
| `description` | نص حر — escape قبل العرض |
| `costPrice` | سري — لا تعرضه للعملاء |
| `salesPrice` | سعر التجزئة — قد يكون `null` |
| `quantityOnHand` / `reservedQuantity` / `availableQuantity` / `inStock` | مجاميع عبر المتغيرات والمستودعات |
| `variants` | دائماً موجود — متغير واحد على الأقل |

### حقول المتغير

| الحقل | ملاحظات |
|-------|---------|
| `id` | **استخدمه في بنود الطلب** |
| `sku` | فريد — مقبول في الطلبات و `/stock?sku=` |
| `unitOfMeasure` | على مستوى المتغير |
| `salesPrice` | `null` → إنشاء الطلب يُرجع **400** |
| `availableQuantity` | قرر بناءً عليه — قد يكون سالباً |

## active والمتغيرات القابلة للبيع

`active=true` على المنتج يعني أن **أي** متغير نشط — قد يحتوي المنتج على متغيرات غير نشطة. للقوائم القابلة للشراء:

```js
const sellable = product.variants.filter(
  v => v.active && v.salesPrice != null && v.inStock,
)
```

## المخزون المدمج

المجاميع مدمجة في قائمة/GET المنتجات — لا حاجة لاستدعاء `/stock` لشاشات الكatalog.

- قرر بناءً على **`availableQuantity`**، لا `quantityOnHand`.
- **`product.inStock`** ≠ `product.availableQuantity > 0`.
- للتفصيل حسب الموقع، استخدم [المخزون](/ar/api-reference/stock).

## costPrice سري

لا تعرض `costPrice` في واجهات العملاء — للإدارة والتسوية فقط.

## أمثلة

```bash
curl -H "X-Api-Key: daqiq_live_your_key" \
  "https://api.daqiqerp.com/api/v1/public/products?sku=TSHIRT-BLK-L"
```

```json
{
  "lines": [{ "sku": "TSHIRT-BLK-L", "quantity": 2 }]
}
```

استخدم **SKU المتغير** — لا `product.sku`.

## الأخطاء

| HTTP | code | متى |
|------|------|-----|
| 400 | `INVALID_REQUEST` | `sortBy` غير مدعوم أو تجاوز 10,000 |
| 403 | `ACCESS_DENIED` | لا يوجد `read_products` |
| 404 | `ENTITY_NOT_FOUND` | معرف منتج/متغير غير معروف |

`sku` غير معروف في القائمة → صفحة فارغة، ليس خطأ.

## قائمة الترحيل

1. `data[]` = منتجات مع `variants[]`.
2. الطلبات والمخزون: `variants[i].id` / `variants[i].sku` فقط.
3. `GET /{id}` يأخذ معرف **المنتج**.
4. استبدل `productName` بـ `name`.
5. أزل استدعاء `/stock` من شاشات القائمة؛ احتفظ به للتفصيل حسب الموقع.
