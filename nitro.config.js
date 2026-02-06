export default defineNitroConfig({
  runtimeConfig: {
    torProxySecret: process.env.NUXT_TOR_PROXY_SECRET,
    public: {
      torSocksUrl: 'socks5h://127.0.0.1:9050',
      robosatsCoordinatorUrl: process.env.NUXT_ROBOSATS_COORDINATOR_URL,
    }
  },
});
