<template>
    <div class="contenedor q-pa-md">
      <div class="row q-gutter-md justify-center items-center">
        <div
          class="menu col-xs-12 col-sm-6 col-md-2 col-lg-2 q-pa-sm q-mb-md"
          v-for="(objeto, i) in tarjeta"
          :key="i"
        >
          <router-link :to="objeto.link" class="text-orange-12">
            <q-card class="my-card bg-orange-12 text-orange-10 text-center" style="height: 200px;">
              <q-card-section>
                <div
                  class="text-h6"
                  style="font-family: Georgia, 'Times New Roman', Times, serif; font-size: large; font-weight: 900;"
                >
                  {{ objeto.item }}
                </div>
              </q-card-section>
              <q-icon :name="objeto.icono" style="font-size: 6em;" />
            </q-card>
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from "axios";
  import { ref } from "vue";
  
  let tarjeta = ref([
    {
      item: "Ventas",
      icono: "🗓️",
      link: "/ventas",
    },
    {
      item: "Ticket",
      icono: "🎟️",
      link: "/billete",
    },
    {
      item: "Buses",
      icono: "🚌",
      link: "/buses",
    },
    {
      item: "Clientes",
      icono: "👥",
      link: "/cliente",
    },
    {
      item: "Conductores",
      icono: "🧑‍✈️",
      link: "/conductor",
    },
    {
      item: "Horarios",
      icono: "🕕",
      link: "/horario",
    },
    {
      item: "Rutas",
      icono: "🚏",
      link: "/ruta",
    },
    {
      item: "Vendedor",
      icono: "👮",
      link: "/vendedor",
    },
  ]);
  
  </script>
  
  <style scoped>
    .menu {
      max-width: 200px; /* Ancho máximo de cada tarjeta */
      width: 100%;
    }
  
    @media only screen and (max-width: 600px) {
      .menu {
        max-width: 100%; /* Ancho completo en pantallas pequeñas */
      }
    }
  </style>
  