import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';


export const useVendedorStore = defineStore('vendedor', () => {
    const vendedores = ref([])
    const obtenerInfoVendedor = async () =>{
        try{
            let responseVendedor = await axios.get('vendedor/vendedor');
            vendedores.value = responseVendedor.data.vendedor;
        } catch (error){
            throw error
        }
    };
    const postVendedor = async (data) =>{
        try {
            let res = await axios.post("vendedor/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putVendedor = async (id, data) => {
        try {
            let res = await axios.put(`vendedor/vendedor/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivarVendedor = async (id)=>{
        try{
            let r = await axios.put(`vendedor/inactivarVendedor/${id}`)
            return r
        } catch (error){
            throw error
        }
    }
    
    const putActivarVendedor = async (id)=>{
        try {
            let r = await axios.put(`/vendedor/activarVendedor/${id}`)
            return r
        } catch (error) {
            throw error
        }
    }

    return {
        vendedores,
        obtenerInfoVendedor, postVendedor, putVendedor, putInactivarVendedor, putActivarVendedor
    };
});