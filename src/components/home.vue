<template>
    <div class="contenedor">

    </div>
    <div class="row absolute-center ">
        <div class="menu" v-for="(objeto, i) in tarjeta" :key="i"  :class="`shadow-up-${6}`">
            <router-link :to="objeto.link" class=" text-orange-12">
                <q-card class="my-card bg-orange-12 text-orange-10 text-center" style=" height: 200px; width: 150px;">
                <q-card-section>
                    <div class="text-h6">{{ objeto.item }}</div>
                </q-card-section>
                <q-icon :name="objeto.icono" style="font-size: 8em;" />
            </q-card>
                </router-link>
            
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { ref } from 'vue';

let tarjeta = ref([
    {
        item: "Ventas",
        icono: "dashboard_customize",
        link:"/ventas"
    },
    {
        item: "Ticket",
        icono: "book_online",
        link: "/billete"
    },
    {
        item: "Buses",
        icono: "directions_bus",
        link: "/buses"
    },
    {
        item: "Clientes",
        icono: "groups",
        link: "/cliente"
    },
    {
        item: "Conductores",
        icono: "directions_bus",
        link: "/conductor"
    },
    {
        item: "Horarios",
        icono: "calendar_today",
        link: "/horario"
    },
    {
        item: "Rutas",
        icono: "route",
        link: "/ruta"
    },
    {
        item: "Vendededor",
        icono: "support_agent",
        link: "/vendedor"
    },
]);


</script>
