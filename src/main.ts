import { createApp } from "vue";
import App from "@/App.vue";
import { containerKey, createContainer } from "@/container";
import { createPinia } from "pinia";

createApp(App)
  .provide(containerKey, createContainer())
  .use(createPinia())
  .mount("#app");
