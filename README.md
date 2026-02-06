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
