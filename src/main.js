import { createApp } from "vue";
import "./assets/css/index.css";
import "@/assets/css/global.css";
import router from "./router";
import App from "./App.vue";
import antd from "ant-design-vue";
import { createPinia } from "pinia";
import { notification } from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

import i18n from "@/i18n/i18n";

notification.config({
  duration: 1.5,
});

createApp(App)
  .use(createPinia())
  .use(router)
  .use(antd)
  .use(i18n())
  .mount("#app");
