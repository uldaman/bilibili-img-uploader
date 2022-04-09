import { createApp } from "vue";
import App from "./Popup.vue";
import mitt from "mitt";
import "../styles";

import "@arco-design/web-vue/dist/arco.min.css";

const app = createApp(App);

const emitter = mitt();
app.provide("emitter", emitter);

app.mount("#app");
