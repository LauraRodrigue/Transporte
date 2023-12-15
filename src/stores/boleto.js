import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useTicketStore = defineStore('ticket', () => {
  const ticket = ref([])
  const postTicket = async (data) => {
    try {
      let res = await axios.post("/ticket/agregar", data);
      console.log(res);
      // ticketCreado.value = res.data.ticket
      // console.log(ticketCreado.value);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const getTickets = async () => {
    try {
      let res = await axios.get("/ticket/ticket");
      ticket.value = res.data.ticket
      return res;
    } catch (error) {
      throw error;
    };
  };

  const putEditarTicket = async (id, data) => {
    try {
      let res = await axios.put(`/ticket/editarTicket/${id}`, data)
      return res
    } catch (error) {
      throw error
    }
  };

  const putInactivarTicket = async (id) => {
    try {
      let res = await axios.put(`/ticket/inactivarTicket/${id}`);
      return res
    } catch (error) {
      throw error
    }
  };

  const putActivarTicket = async (id) => {
    try {
      let res = await axios.put(`/ticket/activarTicket/${id}`)
      return res
    } catch (error) {
      throw error
    }
  };
  const puestos = ref([]);
  const buscarTickets = async (id_ruta, id_bus, fecha) => {
    try {
      let res = await axios.get(`/ticket/encontrartickets?id_ruta=${id_ruta}&id_bus=${id_bus}&fecha=${fecha}`)
      puestos.value = res.data.puestos
      return res
    } catch (error) {
      throw error
    }
  }

  return {
    ticket,puestos,
    postTicket, getTickets, putEditarTicket, putInactivarTicket, putActivarTicket, buscarTickets
  };
});
