import { createRouter, createWebHashHistory } from "vue-router";
import login from "../components/login.vue";
import buses from "../components/buses.vue";
import menu from "../components/menu.vue";
import cliente from "../components/cliente.vue";
import billete from "../components/billete.vue";
import conductor from "../components/conductor.vue";
import horario from "../components/horario.vue";
import ruta from "../components/ruta.vue";
import vendedor from "../components/vendedor.vue";
import home from "../components/home.vue";

const routes = [
  { path: "/", component: login },
  {
    path: "/menu",
    component: menu,
    children: [
      { path: "", component: home },
      { path: "/home", component: home },
      { path: "/buses", component: buses },
      { path: "/cliente", component: cliente },
      { path: "/billete", component: billete },
      { path: "/conductor", component: conductor },
      { path: "/horario", component: horario },
      { path: "/ruta", component: ruta },
      { path: "/vendedor", component: vendedor },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
