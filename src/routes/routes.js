import { createRouter, createWebHashHistory } from "vue-router";
import login from "../components/login.vue";
import buses from "../components/buses.vue";
import menu from "../components/menu.vue";
import cliente from "../components/cliente.vue";
import billete from "../components/boleto.vue";
import conductor from "../components/conductor.vue";
import horario from "../components/horario.vue";
import ruta from "../components/ruta.vue";
import vendedor from "../components/vendedor.vue";
import home from "../components/home.vue";
import ventas from "../components/venta.vue";

function isAuthenticated() {
  const token = localStorage.getItem("token");

  console.log(token);

  if (token) return true;
  else return false;
}

const authGuard = (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    console.log(isAuthenticated());
    if (!isAuthenticated()) {
      next({ path: "/" });
      console.log("h");
    } else {
      next();
      console.log("a");
    }
  } else {
    next();
    console.log("b");
  }
};

const routes = [
  { path: "/", component: login },
  {
    path: "/menu",
    meta: { requiresAuth: true },
    beforeEnter: authGuard,
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
      { path: "/ventas", component: ventas},
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
