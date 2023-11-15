<template>
    
    <div class="column absolute-center">

    <q-card class="my-card bg-orange-2 text-black"  style="height: 430px; width: 350px;">
      <q-card-section class="column flex-center">
        <q-avatar class="material-icons-outlined" size="100px" font-size="52px" color="orange-10" text-color="white" icon="face" >
      </q-avatar>
      </q-card-section>
      <q-card-section>
       <q-form @submit.prevent="validar">
          <q-input v-model="username" placeholder="Usuario" class="input-field" type="text"/>
            <label for="input-field" class="input-label">Usuario</label>
            <span class="input-highlight"></span>

          <q-input placeholder="Password" class="input-field"  v-model="password" name="password" type="password"/>
            <label for="input-field" class="input-label">Password</label>

          <div class="error">{{errorMessage}}</div>

          <div class="text-center">
              <q-btn color="amber" type="submit" class="login-button">Ingresar</q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
    </div>
</template>
<script setup>
import { ref } from "vue";
import { useLoginStore } from "../stores/login.js"
import { useQuasar } from 'quasar'
const loginStore = useLoginStore()

const username = ref('');
const password = ref('');
const $q = useQuasar();
let errorMessage = ref("");


const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: 'Please wait...',
    timeout: 0 
  });
};

let validacion = ref(false);
let notification = ref(null);
async function validar() {
    if (!username.value && !password.value) {
        errorMessage.value = "Ingrese el usuario y la contraseña"
    }else if(!username.value){
        errorMessage.value = "Ingrese el usuario"
    }else if(!password.value){
        errorMessage.value = "Ingrese la contraseña"
    }else{
        errorMessage.value =""
        validacion.value = true;
    };
    if (validacion.value==true) {
        try {
        showDefault()
        await loginStore.Login({
            cuenta: username.value,
            clave: password.value
        });
        if(notification) {
            notification()
        }
        $q.notify({
            spinner: false, 
            message: "Ingresado al programa", 
            timeout: 2000,
            type: 'positive',
        });
    } catch (error) {
        if(notification) {
            notification()
        };
        $q.notify({
            spinner: false, 
            message: `${error.response.data.msg}`, 
            timeout: 2000,
            type: 'negative',
        });
    };
    }
    
    validacion.value = false  
};
</script>



