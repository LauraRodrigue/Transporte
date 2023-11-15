import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useTicketStore = defineStore("ticket", () => {
  const tickets = ref([]);

  const getTicket = async () => {
    try {
      let res = await axios.get(`/ticket/ticket`);
      tickets.value = res.data.ticket;
    } catch (error) {
      throw error;
    }
  };

  const getTicketsPorFechas = async () => {
    try {
      let res = await axios.get(`/ticket/tickets`);
      tickets.value = res.data.ticket;
    } catch (error) {
      throw error;
    }
  };

  const getTicketsPorVendedor = async () => {
    try {
      let res = await axios.get(`/ticket/tickets/vendedor`);
      tickets.value = res.data.ticket;
    } catch (error) {
      throw error;
    }
  };

  const getTicketsPorCliente = async () => {
    try {
      let res = await axios.get(`/ticket/tickets/cliente`);
      tickets.value = res.data.ticket;
    } catch (error) {
      throw error;
    }
  };

  const getRutasPorBus = async () => {
    try {
      let res = await axios.get(`/ticket/tickets/rutas`);
      tickets.value = res.data.ticket;
    } catch (error) {
      throw error;
    }
  };

  const postTicket = async (data) => {
    try {
      let res = await axios.post("ticket/agregar", data);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const putTicket = async (id, data) => {
    try {
      let res = await axios.put(`ticket/editarTicket/${id}`, data);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const putTicketInactivar = async (id) => {
    try {
      let res = await axios.put(`ticket/inactivarTicket/${id}`);
      return res;
    } catch (error) {
      console.log(error, "Error al cambiar el estado del ticket");
    }
  };
  const putTicketActivar = async (id) => {
    try {
      let res = await axios.put(`ticket/activarTicket/${id}`);
      return res;
    } catch (error) {
      console.log(error, "Error al cambiar el estado del ticket");
    }
  };

  return {
    tickets,
    getTicket,
    getTicketsPorFechas,
    getTicketsPorVendedor,
    getTicketsPorCliente,
    getRutasPorBus,
    postTicket,
    putTicket,
    putTicketInactivar,
    putTicketActivar,
  };
});
