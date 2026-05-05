# Server Connectivity Issue — k6 Load Test Server

**Date:** 2026-05-04  
**Reporter:** ext_judavmar@mercadolibre.com  
**Server:** k6-app-instance (Red Hat Linux on GCP)  
**Project:** Motor de Reglas — Performance Testing

---

## Summary

The k6 load test server (`k6-app-instance`) cannot establish outbound HTTPS connections to Fury test environment endpoints. This blocks all k6 performance test executions against the `test--` Fury environments.

---

## Symptoms

- k6 scripts time out with `dial: i/o timeout` after 30 seconds
- Direct `curl` commands to Fury endpoints return `Connection timed out` on port 443
- Affects all `test--*.furyapps.io` hostnames

---

## Root Cause Analysis

### Step 1 — DNS misconfiguration (resolved)

The server's `/etc/resolv.conf` was using only GCP's link-local DNS (`169.254.169.254`) as nameserver, which does not resolve Fury's `test--` hostnames.

**Fix applied:** Added MELI's internal DNS servers and reordered them to take priority:

```
nameserver 10.198.112.55
nameserver 10.198.112.75
nameserver 169.254.169.254
```

After this fix, DNS resolution works correctly. Example:

```
* Trying 35.174.88.65...
* Trying 34.193.125.188...
* Trying 54.156.56.237...
```

### Step 2 — Outbound HTTPS blocked (pending fix)

Despite DNS resolving correctly, all TCP connections to port 443 time out:

```
connect to 35.174.88.65 port 443 failed: Connection timed out
connect to 34.193.125.188 port 443 failed: Connection timed out
connect to 54.156.56.237 port 443 failed: Connection timed out
```

This indicates the GCP instance has no egress firewall rule allowing outbound TCP port 443 to external hosts.

---

## Affected Endpoints

| Endpoint | Purpose |
|---|---|
| `https://test--fps-rule-engine.furyapps.io` | Execution API (k6 Execution scripts) |
| `https://test--fps-integration-api.furyapps.io` | Integration API (k6 IntAPI scripts) |

---

## Action Required

Please apply **one** of the following:

### Option A — GCP Egress Firewall Rule (recommended)
Add a GCP VPC firewall egress rule on the `k6-app-instance` allowing outbound TCP port 443 to the following IPs:

```
35.174.88.65
34.193.125.188
54.156.56.237
```

Or allow outbound TCP 443 to all destinations (`0.0.0.0/0`) if a broader rule is acceptable.

### Option B — Configure HTTPS Proxy
If the infrastructure uses an outbound proxy, provide the proxy URL and configure it on the server:

```bash
export HTTPS_PROXY=http://<proxy-host>:<proxy-port>
```

---

## Validation

Once the fix is applied, run the following from the server to confirm connectivity:

```bash
curl -v --max-time 10 \
  --url "https://test--fps-integration-api.furyapps.io/fpsIntegrationSMU/bulk-execution"
```

Expected: TLS handshake completes and server returns an HTTP response (even 401/400 is acceptable — any HTTP status confirms connectivity).
