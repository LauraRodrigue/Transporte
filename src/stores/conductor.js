import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useConductorStore = defineStore('conductor', () => {
    const conductores = ref([]);

    const obtenerInfoConductores = async () => {
        try {
            let responseConductores= await axios.get('/conductor/conductor');
            conductores.value = responseConductores.data.conductor;
        } catch (error) {
            throw error
        }
    };

    const postConductor = async (data) =>{
        try {
            let res = await axios.post("/conductor/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditarConductor = async (id, data) => {
        try {
            let res = await axios.put(`/conductor/conductor/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivarConductor = async (id)=>{
        try {
            let r = await axios.put(`/conductor/inactivarConductor/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del conductor");
        }
    }
    const putActivarConductor = async (id)=>{
        try {
            let r = await axios.put(`/conductor/activarConductor/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del conductor");
        }
    }

    return {
        conductores,
        obtenerInfoConductores, postConductor, putEditarConductor, putActivarConductor, putInactivarConductor
    };
});