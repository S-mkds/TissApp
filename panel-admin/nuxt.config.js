export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: "static",

  server: {
    port: 5000, // Nouveau port
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "TissApp Administration Panel",
    htmlAttrs: {
      lang: "fr",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/Newlogo.png" }],
  },
  body: {},

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // CSS file in the project
    "@/styles/app.css",
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // ...
    { src: "~/plugins/viewtify.js", mode: "client" },
    { src: "~/plugins/darkModeConfig.js", mode: "client" },
  ],

  hooks: {
    beforeMount() {
      this.$darkModeConfig.toggleDarkMode();
    },
  },
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    "bootstrap-vue/nuxt",
    "moment",
  ],
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
