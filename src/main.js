import "bootstrap/dist/css/bootstrap.min.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "bootstrap";

import Socketio from '@/plugins/Socket.io';


const app = createApp(App);     //uygulama oluşturuluyor

app.use(store);
app.use(router);

app.use(Socketio, {
    connection: process.env.VUE_APP_SOCKET_NET_ADR,
    options: {
        forceNew: true,
    }
});

app.mount("#app");

import "bootstrap/dist/js/bootstrap.min.js";

