import tailwindcss from '@tailwindcss/vite'

const gtmId = process.env.NUXT_PUBLIC_GTM_ID ?? 'GTM-W475SN7P'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      script: [
        {
          innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
          tagPriority: 'critical',
        },
      ],
      noscript: [
        {
          innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          tagPosition: 'bodyOpen',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      shopifyDomain: process.env.SHOPIFY_STORE_DOMAIN,
      shopifyToken: process.env.SHOPIFY_STOREFRONT_TOKEN,
      shopifyApiVersion: process.env.SHOPIFY_API_VERSION ?? '2025-01',
    },
  },
})
