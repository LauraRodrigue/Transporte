import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useRutaStore = defineStore('ruta', () => {
    const rutas = ref([]);

    const obtenerInfoRutas = async () => {
        try {
            let resRutas= await axios.get('/ruta/ruta');
            rutas.value = resRutas.data.ruta;
        } catch (error) {
            throw error
        }
    };

    const postRuta = async (data) =>{
        try {
            let res = await axios.post("/ruta/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditarRuta = async (id, data) => {
        try {
            let res = await axios.put(`/ruta/ruta/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivarRuta = async (id)=>{
        try {
            let r = await axios.put(`/ruta/inactivarRuta/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la ruta");
        }
    }
    const putActivarRuta = async (id)=>{
        try {
            let r = await axios.put(`/ruta/activarRuta/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la ruta");
        }
    }

    return {
        rutas,
        obtenerInfoRutas, postRuta, putEditarRuta, putInactivarRuta, putActivarRuta
    };
});