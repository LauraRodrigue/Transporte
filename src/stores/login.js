import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useAdminStore = defineStore ("admin",()=>{
    const token = ref('');
    const loading = ref(false);
  
    const login = async (cuenta, clave) => {
      console.log(cuenta);
      console.log(clave);
  
      try {
        loading.value = true;
        const r = await axios.post("/vendedor/vendedor_datos", { cuenta: cuenta, clave: clave });
        console.log(r);
        token.value = r.data.token; 
        return r;
      } catch (error) {
        loading.value = false; 
        console.log(error);
        return error; 
      } finally {
        loading.value = false;
      }
    };

    const logout = () => {
      token.value = ''; // Establece el token como vacío para indicar que el usuario ha cerrado sesión
    };
  
    return {
      login,
      token,
      loading,
      logout,
    };
  });