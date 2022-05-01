import { createApp } from "vue";
import App from "@/App.vue";
import { containerKey, createContainer } from "@/container";

createApp(App).provide(containerKey, createContainer()).mount("#app");
