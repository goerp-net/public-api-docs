---
title: Ping
description: Verify API key credentials and see granted scopes.
---

Echoes back what your key resolved to. Useful for confirming credentials before wiring up real calls. Reads and writes nothing.

::api-endpoint{method="GET" path="/v1/public/ping" scope="read_orders"}
::

::api-endpoint{method="POST" path="/v1/public/ping" scope="write_orders"}
::

## Response

```json
{
  "tenantId": "123e4567-e89b-12d3-a456-426614174000",
  "keyName": "Shipping integration",
  "grantedScopes": ["write_orders", "read_orders"],
  "serverTime": "2026-08-01T10:15:30Z"
}
```

`grantedScopes` shows scopes **after implication is applied** — the definitive answer to "what can this key actually do?"

## Example

```bash
curl https://api.daqiqerp.com/api/v1/public/ping \
  -H "X-Api-Key: daqiq_live_your_key_here"
```
