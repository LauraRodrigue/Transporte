import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';


export const useConductorStore = defineStore('conductor', () => {
    const conductores = ref([])
    const getConductor = async () => {
        try {
            let res = await axios.get(`/conductor/conductor`);
            conductores.value = res.data.conductor;
        } catch (error) {
            throw error
        }
    }
    const postConductor = async (data) => {
        try {
            let res = await axios.post(`conductor/agregar`, data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putConductor = async (id, data) => {
        try {
            let res = await axios.put(`conductor/conductor/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivarConductor = async (id) => {
        try {
            let res = await axios.put(`conductor/inactivarConductor/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado del conductor");
        }
    }
    const putActivarConductor = async (id) => {
        try {
            let res = await axios.put(`conductor/activarConductor/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado del conductor");
        }
    }

    return {
        conductores,
        getConductor, postConductor, putConductor, putInactivarConductor, putActivarConductor
    };
});