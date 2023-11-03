import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';


export const useBusStore = defineStore('bus', () => {
    const buses = ref([])
    const searchPlaca = ref('');
    const getBuses = async () => {
        try {
            let res = await axios.get(`/bus/buses`);
            buses.value = res.data.buses;
        } catch (error) {
            throw error
        }
    }
    const postBus = async (data) =>{
        try {
            let res = await axios.post("bus/bus/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditarBus = async (id, data) => {
        try {
            let res = await axios.put(`bus/bus/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivarBus = async (id)=>{
        try {
            let res = await axios.put(`bus/inactivarBus/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado del bus");
        }
    }
    const putActivarBus = async (id)=>{
        try {
            let res = await axios.put(`bus/activarBus/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado del bus");
        }
    }

    return {
        buses,
        searchPlaca,
        getBuses, postBus, putEditarBus, putInactivarBus, putActivarBus
    };
});