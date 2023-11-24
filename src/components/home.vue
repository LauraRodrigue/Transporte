<template>
    <div class="contenedor">

    </div>
    <div class="row absolute-center " style="margin-top:7%;">
        <div class="menu" v-for="(objeto, i) in tarjeta" :key="i"  :class="`shadow-up-${6}`">
            <router-link :to="objeto.link" class=" text-orange-12">
                <q-card class="my-card bg-orange-12 text-orange-10 text-center" style=" height: 200px; width: 160px;">
                <q-card-section>
                    <div class="text-h6" style="font-family:Georgia, 'Times New Roman', Times, serif; font-size: large; font-weight: 900;">{{ objeto.item }}</div>
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
        icono: "🗓️",
        link:"/ventas"
    },
    {
        item: "Ticket",
        icono: "🎟️",
        link: "/billete"
    },
    {
        item: "Buses",
        icono: "🚌",
        link: "/buses"
    },
    {
        item: "Clientes",
        icono: "👥",
        link: "/cliente"
    },
    {
        item: "Conductores",
        icono: "🧑‍✈️",
        link: "/conductor"
    },
    {
        item: "Horarios",
        icono: "🕕",
        link: "/horario"
    },
    {
        item: "Rutas",
        icono: "🚏",
        link: "/ruta"
    },
    {
        item: "Vendededor",
        icono: "👮",
        link: "/vendedor"
    },
    {
        item: "Salir",
        icono:"📤",
        link: "/"
    }
]);


</script>
