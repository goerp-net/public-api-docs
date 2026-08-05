---
title: Scopes
description: API keys carry scopes; each endpoint requires one. Missing scopes return 403 ACCESS_DENIED.
---

Each API key carries a set of scopes. Every endpoint requires a specific scope. If the key lacks the required scope, the API returns **403 ACCESS_DENIED**.

## Scope reference

| Scope | Grants | Implies |
|-------|--------|---------|
| `read_orders` | List and read orders | — |
| `write_orders` | Create orders | `read_orders` |
| `cancel_orders` | Cancel orders | `read_orders` |
| `read_products` | Read the product catalogue | — |
| `read_stock` | Read stock levels | — |
| `read_inventory` | Read warehouses and locations | — |
| `read_customers` | Read customers and contact details | — |
| `write_products` | *(reserved — no endpoints yet)* | `read_products` |

## Scope implication

Implication is applied when the key authenticates. A `write_orders` key can read orders without `read_orders` being granted explicitly.

## Granting scopes

When creating a key in the dashboard, select only the scopes the integration needs:

- **`cancel_orders` is not implied by `write_orders`** — placing orders and voiding them are different levels of trust
- **`read_customers` exposes personal data** — names, phone numbers, emails, and addresses. Grant only to integrations that genuinely need customer contact details
- **`write_products` is defined but no endpoint uses it yet** — granting it does nothing today

## Check effective scopes

Call `GET /v1/public/ping` to see `grantedScopes` after implication is applied — the definitive answer to "what can this key actually do?"
