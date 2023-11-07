<template>
    
    <div class="column absolute-center">

    <q-card class="my-card bg-orange-2 text-black"  style="height: 410px; width: 350px;">
      <q-card-section class="column flex-center">
        <q-avatar class="material-icons-outlined" size="100px" font-size="52px" color="orange-10" text-color="white" icon="face" >
      </q-avatar>
      </q-card-section>
      <q-card-section>
       <q-form @submit="onSubmit" @reset="onReset">
          <q-input
            filled
            v-model="cuenta"
            label="Usuario"
            placeholder="Cuenta"
          />

          <q-input
            filled
            type="number"
            v-model="clave" id="clave"
            label="Contraseña"
            placeholder="Contraseña"
          />

          <q-toggle v-model="accept" label="I accept the license and terms" />

          <div class="text-center">
            <router-link to="/menu">
              <q-btn :loading="useAdmin.loading" label="Ingresar" type="submit" color="orange-10" @click="iniciar()">
                <template v-slot:loading>
                  <q-spinner-radio />
                </template> 
              </q-btn>
            </router-link>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
    </div>
</template>
<script>
import { ref } from 'vue';
import { useAdminStore } from "../stores/login.js"
import { useRouter } from "vue-router"
import { useQuasar } from 'quasar'

export default {
  setup() {
    const cuenta = ref('');
    const clave = ref('');
    const useAdmin = useAdminStore();
    const router = useRouter()
    const $q = useQuasar()
    console.log(useAdmin.loading);

    async function iniciar() {

      let res = await useAdmin.login(cuenta.value, clave.value);
      console.log(res);
      if (!useAdmin.token) {
        $q.notify({
          type: 'negative',
          message: res.response.data.msg
        });
      } else {
        console.log("entra");
        router.push("/home");
        $q.notify({
          type: 'positive',
          message: 'Inicio Exitoso'
        });
      }


    }

    return {
      iniciar,
      cuenta,
      clave,
      useAdmin,
    };
  }
};
</script>
<script setup></script>


