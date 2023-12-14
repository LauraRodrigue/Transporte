import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';


export const useHorarioStore = defineStore('horario', () => {
    const horarios = ref([])


     /* const getHorarioActivos = async () => {
        try {
          let res = await axios.get(`/horario/horario`);
      
          // Filtrar los horarios activos (estado === 1)
          const horariosActivos = res.data.horario.filter(horario => horario.estado === 1);
      
          return horariosActivos;
        } catch (error) {
          throw error;
        }
      };*/
      
    const getHorario = async () => {
        try {
            let res = await axios.get(`/horario/horario`);
            horarios.value = res.data.horario;
        } catch (error) {
            throw error
        }
    }
    const postHorario = async (data) =>{
        try {
            let res = await axios.post("horario/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putHorario = async (id, data) => {
        try {
            let res = await axios.put(`horario/horario/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putHorarioInactivar = async (id)=>{
        try {
            let res = await axios.put(`horario/inactivarHorario/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado del horario");
        }
    }
    const putHorarioActivar = async (id)=>{
        try {
            let res = await axios.put(`horario/activarHorario/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado del horario");
        }
    }

    return {
        horarios,
        getHorario,postHorario, putHorario, putHorarioInactivar, putHorarioActivar
    };
});