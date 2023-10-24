import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useBusStore = defineStore("buses", () => {
    const datosData = ref([])

    const obtener = async () => {
        try {
            const response = await axios.get("bus/buses");
            datosData.value = response.data;
            return response.data;
        } catch (error) {
            console.error('Error al obtener los buses:', error);
            throw error;
        }
    };


    return {
        datosData,
        obtener,
      /*   agregarBus,
        editarBus,
        activarBus,
        desactivarBus, */
    };
});