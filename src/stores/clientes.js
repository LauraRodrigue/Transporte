import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';


export const useClienteStore = defineStore('cliente', () => {
    const clientes = ref([])
    const obtenerInfoClientes = async () => {
        try {
            let responseClientes = await axios.get('/cliente/cliente');
            clientes.value = responseClientes.data.cliente; 
        } catch (error) {
            throw error
        }
    };
    const postCliente = async (data) =>{
        try {
            let res = await axios.post("cliente/cliente/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putCliente = async (id, data) => {
        try {
            let res = await axios.put(`cliente/cliente/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putClienteInactivar = async (id)=>{
        try {
            let res = await axios.put(`cliente/inactivarCliente/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado del cliente");
        }
    }
    const putClienteActivar = async (id)=>{
        try {
            let res = await axios.put(`cliente/activarCliente/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado del cliente");
        }
    }

    return {
        clientes,
        obtenerInfoClientes, postCliente, putCliente, putClienteInactivar, putClienteActivar
    };
});
