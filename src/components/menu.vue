<template>
    <div class="contenedor">
        <q-layout view="hHh lpR fFf">
            <q-header elevated class="bg-orange-10 text-white">
                <q-toolbar>
                    <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
                    <q-toolbar-title style="font-family:Georgia, 'Times New Roman', Times, serif; font-size:larger; font-weight: 900;">
                        <q-avatar>
                            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
                        </q-avatar>
                        Transporte S.A.S
                    </q-toolbar-title>
                    <router-link to="/" class="opcioncont" style="font-size: 2em"><q-btn dense flat round label="salir" @click="cerrarsesion" ></q-btn></router-link>
                </q-toolbar>
            </q-header>

            <q-drawer class="bg-orange-10" v-model="leftDrawerOpen" side="left" behavior="mobile" elevated style="font-family:Georgia, 'Times New Roman', Times, serif; font-size: large; font-weight: 900;">           
                <div class="q-pa-md q-gutter">
                    <div class="text-center" style="margin-top: 3em;">
                        <q-avatar color="orange-12" text-color="black" padding="none" icon="🚍" style="font-size: 7em;" />
                    </div>
                <div class="text-center" >
                    <h4 style="margin-bottom: 0">Usuario</h4>
                    <h5 style="margin-bottom: 1em; margin-top:0.5em">Administrador</h5>
                </div>
                <router-link to="/home" class="opcioncont" style="font-size: 2em">
                    <q-btn no-caps align="aroun" color="orange-12" text-color="black" icon="🏠" label="Menú" style="width: 95%" />
                </router-link>
                <q-linear-progress :value="progress" class="q-mt-md" color="primary" style="margin-bottom: 2em" />
                <router-link to="/conductor" class="opcioncont" style="font-size: 2em">
                    <q-btn no-caps align="aroun" color="orange-12" text-color="black" icon="🧑‍✈️" label="Conductores" style="width: 95%" />
                </router-link>
                <router-link to="/horario" class="opcioncont" style="font-size: 2em">
                    <q-btn no-caps align="left" color="orange-12" text-color="black" icon="🕕" label="Horarios" style="width: 95%" />
                </router-link>
                <router-link to="/ruta" class="opcioncont" style="font-size: 2em">
                    <q-btn no-caps align="left" color="orange-12" text-color="black" icon="🚏" label="Rutas" style="width: 95%" />
                </router-link>
                <router-link to="/buses" class="opcioncont" style="font-size: 2em">
                    <q-btn no-caps align="aroun" color="orange-12" text-color="black" icon="🚌" label="Buses" style="width: 95%" />
                </router-link>
                <router-link to="/cliente" class="opcioncont" style="font-size: 2em">
                    <q-btn no-caps align="left" color="orange-12" text-color="black" icon="👥" label="Clientes" style="width: 95%" />
                </router-link>
                <router-link to="/ventas" class="opcioncont" style="font-size: 2em">
                    <q-btn no-caps align="left" color="orange-12" text-color="black" icon="🗓️" label="Ventas" style="width: 95%" />
                </router-link>
                <router-link to="/billete" class="opcioncont" style="font-size: 2em">
                    <q-btn no-caps align="left" color="orange-12" text-color="black" icon="🎟️" label="Ticket" style="width: 95%" />
                </router-link>
                <router-link to="/vendedor" class="opcioncont" style="font-size: 2em">
                    <q-btn no-caps align="left" color="orange-12" text-color="black" icon="👮" label="Vendedores" style="width: 95%" />
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
            },

            cerrarsesion(){
                localStorage.removeItem('token')
            }
        }
    }
}
</script>
<style scoped>
.q-pa-md q-gutter-sm{
    justify-content: center
}
q-btn{
    color: orange-11;
    width: 95%;
    align-items: left;
}
</style>
