# tor-proxy-nitro

A minimal **Nitro-based Tor HTTP proxy**, designed to expose `.onion` services through a controlled server-side endpoint.

## What this is

- A **Nitro service** that proxies HTTP requests to Tor hidden services using a SOCKS5 Tor daemon
- Can run:
  - **standalone** (as a Nitro server)
  - **embedded as a Nuxt module** inside a Nuxt 3 app
- Includes a **Dockerfile** ready for **DigitalOcean App Platform**, installing and running Tor inside the container

## Current use case

- **Ready to use with RoboSats** coordinators
- Used to access RoboSats endpoints over Tor from environments where direct Tor access is not available (Cloudflare, browsers, etc.)
- Access is protected via a shared secret header

## Architecture notes

- Tor runs **server-side only**
- Requests are forwarded through Tor using `socks-proxy-agent`
- Hop-by-hop and sensitive headers are stripped
- Responses preserve upstream status codes and relevant headers

## Future scope

- May be extended to support **Bisq** if we decide to integrate it as an additional P2P rail
- Intentionally kept generic and rail-agnostic

## Part of the p2pay ecosystem

This project is designed to integrate cleanly with:
- `robosats-nitro`
- `robosats-nuxt`
- `p2pay-core`

while remaining usable as a standalone Tor proxy for other projects.


## Configuration

### Standalone

Set environment variables as explained in the `.env.standalone` file.

### Module

nuxt.config.js
```js
export default defineNuxtConfig({
  modules: [
    'tor-proxy-nitro',
  ],

  torProxyNitro: {
    enabled: true,
    torProxySecret: process.env.NUXT_TOR_PROXY_SECRET,
    torSocksUrl: process.env.NUXT_TOR_SOCKS_URL, // Optional. Defaults to 'socks5h://127.0.0.1:9050'
    robosatsCoordinatorUrl: process.env.NUXT_ROBOSATS_COORDINATOR_URL
  }
})
```
Set environment variables as explained in the `.env.module` file.

