<template>
    <div class="contenedor">
        <q-layout class="bg-orange-1" view="hHh lpR lFf">

            <q-header elevated class="bg-orange-10 text-white">
                <q-toolbar>
                    <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

                    <q-toolbar-title>
                        <q-avatar>
                            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
                        </q-avatar>
                        Transportes S.A.S
                    </q-toolbar-title>
                </q-toolbar>
            </q-header>

            <q-drawer class="bg-green-1" v-model="leftDrawerOpen" side="left" behavior="mobile" bordered>
                <div class="q-pa-md q-gutter-sm">
                    <q-avatar color="orange-10" text-color="white" icon="face" />
                </div>
                <div class="q-pa-md q-gutter-sm">
                    <h3 style="margin-bottom: 0">Usuario</h3>
                    <h5 style="margin-bottom: 0">Administrador</h5>
                </div>
                <div class="q-pa-md q-gutter-sm" style="font-size: 2em">
                    <q-icon name="home" />
                    <router-link to="/home"><q-btn text-color="black" label="Menu"/></router-link><br>

                    <q-icon>
                        <img src="https://cdn-icons-png.flaticon.com/128/846/846047.png">
                    </q-icon>
                    <router-link to="/billete"><q-btn text-color="black" label="boletos" /></router-link><br>

                    <q-icon>
                        <img src="https://cdn-icons-png.flaticon.com/128/2554/2554966.png">
                    </q-icon>
                    <router-link to="/buses"><q-btn text-color="black" label="buses" /></router-link><br>

                    <q-icon name="person" />
                    <router-link to="/cliente"><q-btn text-color="black" label="clientes" /></router-link><br>
                
                    <q-icon>
                        <img src="https://cdn-icons-png.flaticon.com/128/5283/5283024.png">
                    </q-icon>
                    <router-link to="/conductor"><q-btn text-color="black" label="conductores" /></router-link><br>

                    <q-icon name="today" />
                    <router-link to="/horario"><q-btn text-color="black" label="horarios" /></router-link><br>

                    <q-icon>
                        <img src="https://cdn-icons-png.flaticon.com/128/5193/5193890.png">
                    </q-icon>
                    <router-link to="/ruta"><q-btn text-color="black" label="rutas" /></router-link><br>

                    <q-icon>
                        <img src="https://cdn-icons-png.flaticon.com/128/2127/2127287.png">
                    </q-icon>
                    <router-link to="/vendedor"><q-btn text-color="black" label="vendedores" /></router-link><br>
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
  