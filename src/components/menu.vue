<template>
    <div class="contenedor">
        <q-layout view="hHh lpR fFf">
            <q-header elevated class="bg-orange-10 text-white">
                <q-toolbar>
                    <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
                    <q-toolbar-title>
                        <q-avatar>
                            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
                        </q-avatar>
                        Title
                    </q-toolbar-title>
                </q-toolbar>
            </q-header>

            <q-drawer class="bg-orange-10" v-model="leftDrawerOpen" side="left" behavior="mobile" elevated>           
                <div class="q-pa-md q-gutter">
                    <div class="q-pa-md q-gutter-sm" style="margin-top: 3em;">
                        <q-avatar color="orange-12" text-color="black" padding="none" icon="face" style="font-size: 7em;" />
                    </div>
                <div class="q-pa-md q-gutter-sm">
                    <h4 style="margin-bottom: 0">Usuario</h4>
                    <h5 style="margin-bottom: 0">Administrador</h5>
                </div>
                <router-link to="/home" class="opcioncont" style="font-size: 2em">
                    <q-btn no-caps align="left" color="orange-12" text-color="black" icon="home" label="Home" style="width: 95%" />
                </router-link>
                    <q-linear-progress :value="progress" class="q-mt-md" color="primary" style="margin-bottom: 2em" />
                <router-link to="/home" class="opcioncont" style="font-size: 2em">
                    <q-btn no-caps align="aroun" color="orange-12" text-color="black" icon="directions_bus" label="Conductores" style="width: 95%" />
                </router-link>
                <router-link to="/home" class="opcioncont" style="font-size: 2em">
                    <q-btn no-caps align="left" color="orange-12" text-color="black" icon="calendar_today" label="Horarios" style="width: 95%" />
                </router-link>
                <router-link to="/home" class="opcioncont" style="font-size: 2em">
                    <q-btn no-caps align="left" color="orange-12" text-color="black" icon="route" label="Rutas" style="width: 95%" />
                </router-link>
                <router-link to="/home" class="opcioncont" style="font-size: 2em">
                    <q-btn no-caps align="left" color="orange-12" text-color="black" icon="groups" label="Clientes" style="width: 95%" />
                </router-link>
                <router-link to="/home" class="opcioncont" style="font-size: 2em">
                    <q-btn no-caps align="left" color="orange-12" text-color="black" icon="dashboard_customize" label="Ventas" style="width: 95%" />
                </router-link>
                <router-link to="/home" class="opcioncont" style="font-size: 2em">
                    <q-btn no-caps align="left" color="orange-12" text-color="black" icon="book_online" label="Ticket" style="width: 95%" />
                </router-link>
                <router-link to="/home" class="opcioncont" style="font-size: 2em">
                    <q-btn no-caps align="left" color="orange-12" text-color="black" icon="support_agent" label="Vendedores" style="width: 95%" />
                </router-link>
                <q-linear-progress :value="progress" class="q-mt-md" />

                </div>
            </q-drawer>

            <q-page-container>
                <router-view />
            </q-page-container>

        </q-layout>

    </div>
</template>
<script>
import { ref } from 'vue'

export default {
    setup() {
        const leftDrawerOpen = ref(false)

        return {
            leftDrawerOpen,
            toggleLeftDrawer() {
                leftDrawerOpen.value = !leftDrawerOpen.value
            }
        }
    }
}
</script>
  