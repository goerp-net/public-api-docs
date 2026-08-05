Public API
Partner-facing HTTP API, authenticated with tenant-issued API keys.

This document has two audiences:

Part 1 — Managing API keys is for the front-end team building the API-keys settings page. Those endpoints are internal, authenticated with the normal user JWT.
Part 2 — Using the public API is for developers writing an integration against a key. This is the part to hand to a partner.
Everything below reflects the implementation as of commit e909ca96.

Base URLs
Environment	Base URL
Development	https://api-dev.goerp.net/api
Local	http://localhost:8080/api
The /api context path is part of the URL. Every path in this document is relative to the base URL, so /v1/public/orders is https://api-dev.goerp.net/api/v1/public/orders.

Interactive reference: /swagger-ui/index.html. Public endpoints are tagged Public API - * and use the ApiKey security scheme; click Authorize, paste a key into the ApiKey box, and the X-Api-Key header is sent for you.

Part 1 — Managing API keys
For the settings page. All endpoints are under /v1/api-keys, authenticated with the normal Authorization: Bearer <JWT> header.

Only users with the TENANT_ADMIN role can reach any of these. There is no permission that delegates key management to other roles — this was a deliberate decision, since a key is a credential to the tenant's whole public API. Non-admins get 403 ACCESS_DENIED. Hide the page for them rather than letting them discover it by 403.

Key format and the one-time secret
A key looks like:

daqiq_live_x8s0Ff2kQ1mZ7pR4tYvB9nL6wA3sD5gH8jK2xC0vN1q
└─ prefix ─┘└──────────── 43 random base64url chars ────────────┘
Only a SHA-256 hash of the key is stored. The plaintext is returned exactly once, in the create response, and can never be retrieved again. The UI must make that unmissable — a copy button, a "you won't see this again" warning, and no navigation away until the user confirms they have it. A user who loses it has to delete the key and create another.

The keyPrefix field returned on every key is the first 16 characters of the plaintext (daqiq_live_x8s0). It is not secret and exists so a user can tell their keys apart in a list.

POST /v1/api-keys — create
Request:

{
  "name": "Shipping integration",
  "scopes": ["read_orders", "write_orders"],
  "expiresAt": "2027-01-01T00:00:00Z",
  "neverExpires": false
}
Field	Type	Required	Notes
name	string	yes	Max 255 chars. Free text, shown in listings.
scopes	string[]	yes	At least one. See Scopes. Unknown values are rejected.
expiresAt	ISO-8601 instant	no	Ignored when neverExpires is true.
neverExpires	boolean	no	Defaults to false. When true, expiresAt is stored as null.
201 Created:

{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Shipping integration",
  "keyPrefix": "daqiq_live_x8s0",
  "scopes": ["read_orders", "write_orders"],
  "enabled": true,
  "expiresAt": "2027-01-01T00:00:00Z",
  "lastUsedAt": null,
  "createdAt": "2026-08-01T09:00:00Z",
  "updatedAt": "2026-08-01T09:00:00Z",
  "plaintextKey": "daqiq_live_x8s0Ff2kQ1mZ7pR4tYvB9nL6wA3sD5gH8jK2xC0vN1q"
}
plaintextKey appears only here. Every other response omits it.

Errors: 400 INVALID_REQUEST for an unknown scope ("Unknown API scope: read_everything") or an empty scope list.

POST /v1/api-keys/search — list
Uses the standard internal filter envelope. An empty body {} (or no body) returns the first page.

{
  "page": 0,
  "size": 20,
  "sort": ["createdAt,desc"],
  "search": "shipping",
  "filters": [
    { "field": "enabled", "operation": "EQUALS", "value": true }
  ]
}
search matches across name, keyPrefix, scopes.
filters may use id, name, keyPrefix, scopes, enabled, expiresAt, lastUsedAt, createdAt, updatedAt. Anything else is rejected.
200 OK:

{
  "data": [ { "id": "...", "name": "...", "keyPrefix": "...", "scopes": ["read_orders"],
              "enabled": true, "expiresAt": null, "lastUsedAt": "2026-08-01T11:20:00Z",
              "createdAt": "...", "updatedAt": "..." } ],
  "totalCount": 3,
  "noOfPages": 1,
  "pageNo": 0,
  "rowsPerPage": 20
}
Results are scoped to the caller's tenant automatically.

GET /v1/api-keys/{id} — get one
200 OK with the same shape as a list row. 404 ENTITY_NOT_FOUND if it does not exist, 403 ACCESS_DENIED if it belongs to another tenant.

PATCH /v1/api-keys/{id}/enable and /disable
No body. Returns the updated key. Disabling takes effect immediately — the next request using that key gets 401 API_KEY_DISABLED. There is no caching, so there is no propagation delay to warn users about.

Prefer disable over delete in the UI: it is reversible, and it lets a user test whether an integration still depends on a key before destroying it.

DELETE /v1/api-keys/{id}
204 No Content. Permanent and immediate. Worth a confirmation dialog naming the key.

GET /v1/api-keys/scopes — scope picker
Drives the scope selector. Returns the full list, so new scopes appear without a front-end release:

[
  { "scope": "read_orders", "description": "Read sales orders" },
  { "scope": "write_orders", "description": "Create sales orders" }
]
Do not hardcode this list.

Displaying lastUsedAt
lastUsedAt answers "is this key still in use?" — useful for spotting keys safe to revoke.

It is deliberately imprecise. It is refreshed at most once per key per 5 minutes and written asynchronously, to keep a database write off every public API request. So a key used seconds ago may show a timestamp up to 5 minutes stale, and a key used once may briefly still show null.

Display it as a coarse relative time ("used 2 hours ago", "never used"). Do not present it as a precise last-request timestamp, and do not build "used in the last minute" logic on it.

Suggested page layout
Nothing here is enforced by the API; it just tends to avoid support tickets.

List: name, keyPrefix, scopes as chips, enabled toggle, lastUsedAt relative, expiresAt.
Create dialog: name, scope multi-select from /scopes, expiry with a "never expires" toggle.
Post-create: full-screen reveal of plaintextKey with copy-to-clipboard and an explicit acknowledgement before dismissing.
Expired keys: expiresAt in the past still returns enabled: true, because expiry and enablement are separate fields. Compute "expired" client-side from expiresAt and badge it, or users will be confused by an enabled key that returns 401.
Part 2 — Using the public API
This is the part to hand to a partner developer.

Authentication
Send the key in the X-Api-Key header on every request:

curl https://api-dev.goerp.net/api/v1/public/orders \
  -H "X-Api-Key: daqiq_live_x8s0Ff2kQ1mZ7pR4tYvB9nL6wA3sD5gH8jK2xC0vN1q"
Not Authorization: Bearer — that header is for user sessions and is ignored here.

The key identifies the tenant. You cannot specify a tenant in any request; every read is scoped to the key's tenant and every write is attributed to it. There is no combination of parameters that reaches another tenant's data.

/v1/public/** is served by a separate security chain from the rest of the application. An API key cannot authenticate a non-public endpoint, and a user JWT cannot authenticate a public one.

Scopes
A key carries scopes; each endpoint requires one. A missing scope is 403 ACCESS_DENIED.

Scope	Grants	Implies
read_orders	List and read orders	—
write_orders	Create orders	read_orders
cancel_orders	Cancel orders	read_orders
read_products	Read the product catalogue	—
read_stock	Read stock levels	—
read_inventory	Read warehouses and locations	—
read_customers	Read customers and contact details	—
write_products	(reserved — no endpoints yet)	read_products
Implication is applied when the key authenticates, so a write_orders key can read orders without read_orders being granted explicitly.

Two things worth noting when deciding what to grant:

cancel_orders is not implied by write_orders. Placing orders and voiding them are different levels of trust. An integration that only submits orders should not be able to cancel them.
read_customers exposes personal data — names, phone numbers, email addresses and home addresses — and allows enumerating the entire customer base. Grant it only to integrations that genuinely need to contact customers.
write_products is defined but no endpoint uses it. Granting it does nothing today.

Errors
Every error uses the same envelope, except HTTP 429 from the request rate limit, which returns plain text — see Rate limits.

{
  "code": "API_KEY_EXPIRED",
  "message": "This API key has expired.",
  "errorDetails": "No product found with SKU: NOPE",
  "traceParent": "00-6a6ddf1d5144f16d79383143e0ea9b93-4c464f444c6a5413-00",
  "timestamp": "2026-08-01T11:57:17.698Z"
}
Branch on code, never on message. code is a stable identifier; message is human-readable, localized via Accept-Language (en and ar supported), and may be reworded at any time. errorDetails carries the specific cause where there is one — the offending SKU, the field at fault — and is absent otherwise. traceParent is worth logging: quote it in a support request and we can find the exact request.

Known defect: authentication failures (the four API_KEY_* codes) are rendered before the localization layer, so message currently contains a raw message key such as error.apiKey.invalid rather than a sentence. code is correct and stable for all of them. Do not surface message to end users for 401s until this is fixed.

HTTP	code	Meaning
401	API_KEY_MISSING	No X-Api-Key header
401	API_KEY_INVALID	Unrecognised or malformed key
401	API_KEY_DISABLED	Key exists but has been disabled
401	API_KEY_EXPIRED	Key is past its expiresAt
403	ACCESS_DENIED	Key lacks the required scope, or the record belongs to another tenant
400	INVALID_REQUEST	Bad parameter, unknown SKU, unpriced product, ambiguous warehouse
400	VALIDATION_ERROR	Body failed validation; see fieldErrors
404	ENTITY_NOT_FOUND	No such record for this tenant
429	RATE_LIMIT_EXCEEDED	Too many requests
A record belonging to another tenant returns 403 or 404 depending on the resource — never the record. Do not treat 403 and 404 as distinguishable evidence about whether an id exists.

Rate limits
120 requests per minute per key, refilled as a whole bucket each minute.

The budget is shared across all /v1/public/* paths, so reading products and creating orders draw on the same 120. It is per key, not per tenant, so one integration cannot exhaust another's allowance.

Exceeding it returns HTTP 429. Note the inconsistency: this response is plain text, not the JSON envelope every other error uses —

Content-Type: text/plain

Too many requests. Please try again later.
so parse defensively, or check the status code before attempting to read JSON. There is no Retry-After header; back off and retry after a minute.

The separate 429 raised after repeated authentication failures does use the JSON envelope, with code: "RATE_LIMIT_EXCEEDED".

Repeated authentication failures from one IP address are separately budgeted and will start returning 429 before they reach the database. This never affects a caller sending a valid key.

Pagination
List endpoints take page and pageSize and return the same envelope:

{
  "data": [],
  "page": 0,
  "pageSize": 20,
  "totalItems": 137,
  "totalPages": 7
}
Parameter	Default	Limit
page	0	Zero-based
pageSize	20	Max 500
sortBy	createdAt	Per-resource whitelist
sortDirection	desc	asc or desc
Sorting by a field the endpoint does not publish is 400, with the supported list in the message.

The 10,000 result limit
page × pageSize may not exceed 10,000. Beyond that you get:

{ "code": "INVALID_REQUEST",
  "message": "Cannot page beyond 10000 results (page 21 x pageSize 500 = 10500). Narrow the query and page within it." }
This exists because offset paging makes the database walk and discard every preceding row, and because rows shift between requests as records are created — so deep paging is both slow and lossy.

To read more than 10,000 records, walk forward by time instead of by page. Sort ascending, keep page=0, and move the lower bound each round:

GET /v1/public/orders?sortBy=createdAt&sortDirection=asc&pageSize=500
  → 500 orders; note the last createdAt

GET /v1/public/orders?sortBy=createdAt&sortDirection=asc&pageSize=500
      &createdAfter=2026-01-04T11:22:33Z
  → next 500

repeat until a response returns fewer than pageSize
Every request sits at offset 0, so this stays fast at any depth. 100,000 orders is 200 requests, about two minutes at the rate limit.

Two things to handle: createdAfter is inclusive, so records sharing the boundary timestamp reappear — deduplicate by id. And if more than pageSize records share one exact timestamp, the window cannot advance; use a larger pageSize if you hit that.

Cursor-based pagination is planned and will remove this limit.

Orders
GET /v1/public/orders — list
Scope: read_orders

Parameter	Type	Notes
status	enum	NEW, CONFIRMED, CANCELLED, RESCHEDULED, RETURN_REQUESTED
orderType	enum	SALES, RETURN, EXCHANGE
createdAfter	instant	Inclusive
createdBefore	instant	Inclusive
sortBy	string	createdAt, updatedAt, orderDate, amountTotal
An inverted date range (createdAfter later than createdBefore) is 400 rather than an empty page, so an empty result always means "no matching orders".

Orders hidden by the tenant's subscription state are never returned. See Over-quota orders.

GET /v1/public/orders/{id} — get one
Scope: read_orders

{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "orderNumber": "SO/2026/00042",
  "orderType": "SALES",
  "status": "CONFIRMED",
  "shippingStatus": "NOT_SHIPPED",
  "paymentStatus": "PENDING",
  "customerName": "Mona Ali",
  "customerPhone": "+201001234567",
  "shippingAddress": "12 Nile St, Apt 4",
  "shippingCity": "Giza",
  "shippingGovernorate": "Giza",
  "trackingNumber": null,
  "orderDate": "2026-07-19",
  "amountUntaxed": 378.00,
  "amountTax": 52.92,
  "amountTotal": 460.92,
  "shippingCost": 30.00,
  "lines": [
    {
      "id": "...",
      "productVariantId": "...",
      "sku": "TSHIRT-BLK-L",
      "name": "T-Shirt, Black, Large",
      "quantity": 2,
      "unitPrice": 199.00,
      "discount": 20.00,
      "subtotal": 378.00
    }
  ],
  "createdAt": "2026-07-19T09:00:00Z",
  "updatedAt": "2026-07-19T09:30:00Z"
}
Enum values:

status — NEW, CONFIRMED, CANCELLED, RESCHEDULED, RETURN_REQUESTED
shippingStatus — NOT_SHIPPED, SENT_TO_SHIPPING_INTEGRATION, SENT_TO_SHIPPING_COMPANY, IN_TRANSIT, DELIVERED, RETURNED
paymentStatus — PENDING, PARTIALLY_COLLECTED, COLLECTED, REFUND_PENDING, PARTIALLY_REFUNDED, REFUNDED
New enum values may be added over time. Treat unrecognised values as unknown rather than failing.

POST /v1/public/orders — create
Scope: write_orders

{
  "externalOrderId": "webshop-98217",
  "customerName": "Mona Ali",
  "customerPhone": "+201001234567",
  "customerPhoneAlt": null,
  "shippingGovernorate": "Giza",
  "shippingCity": "Giza",
  "shippingRegion": "Dokki",
  "shippingAddress": "12 Nile St, Apt 4",
  "orderDate": "2026-08-01",
  "paymentMethod": "CASH_ON_DELIVERY",
  "warehouseId": null,
  "notes": "Ring the bell twice",
  "lines": [
    { "sku": "TSHIRT-BLK-L", "quantity": 2, "discount": 0, "isFixedDiscount": false }
  ]
}
Field	Required	Notes
externalOrderId	no	Your own reference. Makes the request idempotent — see below. Max 255.
customerName	yes	
customerPhone	yes	
customerPhoneAlt	no	
shippingGovernorate	yes	
shippingCity	yes	
shippingRegion	no	
shippingAddress	yes	
orderDate	no	YYYY-MM-DD. Defaults to today.
paymentMethod	no	CASH_ON_DELIVERY (default) or CREDIT
warehouseId	conditional	Optional when the tenant has one active warehouse; required when more than one
notes	no	
lines	yes	At least one
Each line:

Field	Required	Notes
sku	one of	SKU of the variant
productVariantId	one of	Alternative to sku
quantity	yes	Greater than 0
discount	no	Defaults to 0
isFixedDiscount	no	false (default) = percentage, true = fixed amount
Provide exactly one of sku and productVariantId per line. Both, or neither, is 400.

You cannot set prices. Unit prices come from the tenant's retail price list. There is no field to override them at line or order level. Tax and unit of measure are likewise resolved from the product.

Returns 201 Created with the full order, in the same shape as GET /orders/{id}.

Idempotency
Supplying externalOrderId makes creation safe to retry. Repeating a request with a reference already used returns 200 OK with the order created the first time, instead of 201 Created with a second order.

Use it for anything you might retry — a timeout, a network failure, a queue redelivery. Generate one reference per logical order and reuse it across attempts.

Limitation: this is best-effort. Two concurrent identical requests can both find nothing and both create an order, because uniqueness is not enforced at the database level. Serialise retries for the same reference rather than firing them in parallel.

Creation errors
All 400 INVALID_REQUEST unless noted, with the offending SKU named in the message:

Cause	HTTP	Message
Unknown SKU	404 ENTITY_NOT_FOUND	No product found with SKU: NOPE
Unknown productVariantId	404 ENTITY_NOT_FOUND	Product variant not found: <id>
Warehouse not the tenant's	404 ENTITY_NOT_FOUND	Warehouse not found: <id>
Product has no retail price	400 INVALID_REQUEST	No retail price is configured for: TSHIRT-BLK-L
Product has no sales tax	400 INVALID_REQUEST	No sales tax is configured for: TSHIRT-BLK-L
Tenant has no retail price list	400 INVALID_REQUEST	This account has no retail price list configured, so orders cannot be priced
Several warehouses, none given	400 INVALID_REQUEST	warehouseId is required because this account has 3 active warehouses
Line names both or neither product	400 INVALID_REQUEST	Each line must specify exactly one of sku or productVariantId
The last three are configuration problems on the tenant's side, not bugs in your request — surface them to whoever administers the account.

Stock and order creation
Orders created through this API do not reserve stock at creation, deliberately. An order for an out-of-stock variant is accepted and reserved later when it is confirmed. So a successful create does not guarantee the items are available — check /v1/public/stock first if that matters.

Over-quota orders
If the tenant is over its subscription limit with insufficient balance, the order is still created and you still get 201 — but it is hidden, which means it will not appear in GET /v1/public/orders and GET /v1/public/orders/{id} returns 404.

This is existing platform behaviour, not an API quirk. If a created order seems to vanish, the tenant's subscription is the first thing to check.

POST /v1/public/orders/{id}/cancel — cancel
Scope: cancel_orders — not granted by write_orders.

Body is optional:

{ "reason": "Customer changed their mind" }
Returns 200 OK with the order, now status: "CANCELLED". Reserved stock is released.

Cause	Response
Already shipped	400 VALIDATION_ERROR — Cannot cancel order that has been shipped. Current shipping status: IN_TRANSIT
Already cancelled	400 VALIDATION_ERROR — Order is already cancelled
Another tenant's order	403 ACCESS_DENIED
No such order	404 ENTITY_NOT_FOUND
Cancellable only while shippingStatus is NOT_SHIPPED or SENT_TO_SHIPPING_INTEGRATION.

Products
Scope: read_products

Products are published at variant level — a variant is what carries a SKU and what an order line refers to.

GET /v1/public/products
Parameter	Type	Notes
sku	string	Exact match
search	string	Partial match on name, SKU or barcode
active	boolean	Omit for both
sortBy	string	createdAt, updatedAt, sku, name
GET /v1/public/products/{id}
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "sku": "TSHIRT-BLK-L",
  "barcode": "6221031492018",
  "name": "T-Shirt, Black, Large",
  "productName": "T-Shirt",
  "unitOfMeasure": "Piece",
  "salesPrice": null,
  "active": true,
  "imageUrl": "https://cdn.example.com/tshirt-black.jpg",
  "createdAt": "2026-07-19T09:00:00Z",
  "updatedAt": "2026-07-19T09:30:00Z"
}
salesPrice is the retail price an order line will use. Cost price is never exposed.

Known defect: salesPrice is populated on the list endpoint but is currently always null on GET /v1/public/products/{id}, because the underlying single-record lookup enriches inventory figures but not prices. Read prices from the list endpoint — filtering by sku returns a single row with the price present — until this is fixed.

Stock
Scope: read_stock

GET /v1/public/stock
Returns one row per variant per location, as held internally. A variant stored across three locations produces three rows — sum them yourself for a total.

Parameter	Type	Notes
sku	string	Translated to a variant; unknown SKU is 404
productVariantId	uuid	Alternative to sku
warehouseId	uuid	Restrict to one warehouse
sortBy	string	createdAt, updatedAt
{
  "productVariantId": "123e4567-e89b-12d3-a456-426614174001",
  "sku": "TSHIRT-BLK-L",
  "warehouseId": "123e4567-e89b-12d3-a456-426614174002",
  "locationId": "123e4567-e89b-12d3-a456-426614174003",
  "locationName": "Aisle 3 / Shelf B",
  "quantityOnHand": 40,
  "reservedQuantity": 6,
  "availableQuantity": 34,
  "lastMovementAt": "2026-07-19T09:30:00Z"
}
availableQuantity is quantityOnHand - reservedQuantity — units free to sell. That is the number to check before promising stock, not quantityOnHand.

An unknown sku filter returns 404 rather than silently ignoring the filter and returning everything.

Inventory
Scope: read_inventory

GET /v1/public/warehouses
Not paginated — returns all of the tenant's warehouses.

[
  { "id": "123e4567-e89b-12d3-a456-426614174002",
    "name": "Cairo Main", "code": "CAI-01", "city": "Cairo", "active": true }
]
This is how you find the warehouseId that order creation asks for when a tenant runs more than one warehouse. Use an active one.

GET /v1/public/warehouses/{id}/locations
Not paginated. 404 if the warehouse is not the tenant's.

[
  { "id": "123e4567-e89b-12d3-a456-426614174003",
    "warehouseId": "123e4567-e89b-12d3-a456-426614174002",
    "name": "Aisle 3 / Shelf B", "code": "A3-B", "type": "INTERNAL",
    "pickable": true, "receivable": true, "active": true }
]
type is one of INTERNAL, EXTERNAL, STAGING, PICKING, RECEIVING, SHIPPING, QUARANTINE, RETURNS, VIRTUAL_VENDOR, VIRTUAL_CUSTOMER, VIRTUAL_ADJUSTMENT, VIRTUAL_TRANSIT. Locations mainly matter for interpreting the locationId on stock rows.

Customers
Scope: read_customers

Returns personal data. Handle it accordingly, store only what you need, and honour deletion requests from the tenant.

GET /v1/public/customers
Parameter	Type	Notes
phone	string	Exact match on the primary number
search	string	Partial match on name, email, either phone, or code
sortBy	string	createdAt, updatedAt, fullName
GET /v1/public/customers/{id}
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "code": "CUST-00042",
  "fullName": "Mona Ali",
  "email": "mona@example.com",
  "phone": "+201001234567",
  "phoneAlt": null,
  "governorate": "Giza",
  "city": "Giza",
  "region": "Dokki",
  "address": "12 Nile St, Apt 4",
  "active": true,
  "createdAt": "2026-07-19T09:00:00Z",
  "updatedAt": "2026-07-19T09:30:00Z"
}
404 for a customer belonging to another tenant — ownership is checked before the record is read.

Diagnostics
GET /v1/public/ping / POST /v1/public/ping
Scopes: read_orders for GET, write_orders for POST.

Echoes back what your key resolved to. Useful for confirming credentials and granted scopes before wiring up real calls. Reads and writes nothing.

{
  "tenantId": "123e4567-e89b-12d3-a456-426614174000",
  "keyName": "Shipping integration",
  "grantedScopes": ["write_orders", "read_orders"],
  "serverTime": "2026-08-01T10:15:30Z"
}
grantedScopes shows scopes after implication is applied, so it is the definitive answer to "what can this key actually do".

Integration checklist
Store the key as a secret. Environment variable or secret manager — never in source control, never in a browser. It is a bearer credential with no second factor.
Confirm with /v1/public/ping before anything else. Cheapest way to distinguish a bad key from a bad request.
Branch on code, not message. Messages are localized and may be reworded.
Use externalOrderId on every create, and serialise retries for the same reference.
Handle 429 with a back-off, not a tight retry loop.
Check availableQuantity before promising stock — creation does not reserve it.
Don't page past 10,000. Use the time-window walk for bulk reads.
Log traceParent on every failure. It is what makes a support request answerable.
Tolerate new enum values and new response fields. Both will be added without a version bump.
Compatibility
Additive changes ship without notice: new endpoints, new optional request fields, new response fields, new enum values, new scopes. Parse leniently.

Breaking changes — removing or renaming a field, removing an enum value, tightening validation, changing a status code — go through a new version prefix. /v1/public will not break under you.

Known limitations
Auth error message is a raw i18n key	Use code. Fix pending.
429 from the rate limit is plain text, not JSON	Check the status before parsing. Fix pending.
Idempotency is best-effort	Concurrent identical creates can both succeed. Serialise retries.
No Retry-After on 429	Back off a minute.
Paging capped at 10,000	Use the time-window walk. Cursors planned.
salesPrice is null on GET /products/{id}	Use the list endpoint filtered by sku. Fix pending.
write_products grants nothing	Defined but unused.
Order update is not exposed	Create and cancel only.
lastUsedAt is up to 5 minutes stale	By design; keeps a write off every request.