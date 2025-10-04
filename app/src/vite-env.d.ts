/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />
/// <reference types="vite-plugin-vue-css-modules/macros" />

interface ImportMetaEnv {
  APP_GQL_ENDPOINT: string;
  APP_BASE_URL: string;
}

declare module "octicons:*" {
  import { Component } from "vue";
  export default Component;
}
