import { createApp } from 'vue';
import App from './App.vue';
import router from "./router";
import store from "./state/store";

import vClickOutside from "click-outside-vue3";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import '@/assets/main.css'

createApp(App)
    .use(store)
    .use(router)
    .use(vClickOutside)
    .mount('#app');