// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  modules: [
    "@nuxt/ui",
    "@sidebase/nuxt-auth",
    "@nuxt/image",
  ],
  devServer: {
    port: 3000,
  },
  runtimeConfig: {
    public: {
      pixabayApiKey: process.env.PIXABAY_API_KEY,
    },
    auth: {
      secret: process.env.AUTH_SECRET,
      origin: process.env.AUTH_ORIGIN,
    },
    mongodb: process.env.MONGODB_URI
  },

  routeRules: {
    "/api/**": {
      cors: true,
    },
  },

  auth: {
    provider: {
      type: "authjs",
    },
    baseURL: process.env.AUTH_ORIGIN,
  },
  // plugins: [
  //   {
  //     src: "~/plugins/quill.plugin.ts",
  //     ssr: false,
  //   },
  // ],
});
