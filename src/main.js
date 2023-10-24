import { createApp } from 'vue'
import{router} from "./routes/routes.js"
import { Quasar } from 'quasar'
import { createPinia } from 'pinia'
import './style.css'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import App from './App.vue'
import axios from 'axios';

axios.defaults.baseURL = "https://transporte-czaa.onrender.com/api/"

const pinia = createPinia();
const app = createApp(App);

app.use(Quasar, {
    plugins: {}, 
  })

app.use(pinia);
app.use(router);
app.mount('#app');

