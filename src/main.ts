import "./assets/main.css";
// Add the necessary CSS
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import { createBootstrap } from "bootstrap-vue-next/plugins/createBootstrap";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia); // ✅ obligatoire avant d'utiliser un store

app.use(createBootstrap());
app.use(router);
app.mount("#app");
