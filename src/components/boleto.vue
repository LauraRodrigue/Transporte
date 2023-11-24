<template>
  <div>
    <div align="center">
      <h3 align="center">Tickets</h3>
      <q-table :rows="rows" :columns="columns" row-key="name" style="width:90%">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <label for="" v-if="props.row.estado == 1" style="color: green;">Activo</label>
            <label for="" v-else style="color: red;">Inactivo</label>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="amber" @click="InactivarTicket(props.row._id)" v-if="props.row.estado == 1"><q-icon
                name="❌" /></q-btn>
            <q-btn color="amber" @click="ActivarTicket(props.row._id)" v-else><q-icon
                name="⭕" /></q-btn>
          </q-td>
          <q-btn class="btnEditar" color="white" text-color="black" label="📄" @click="generarPDF(props.row)" />
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { useTicketStore } from "../stores/boleto.js";
import { useQuasar } from 'quasar'
import { jsPDF } from "jspdf";
const TicketStore = useTicketStore();

let tickets = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref("");
let vendedor_id = ref("");
let cliente_id = ref();
let bus_id = ref("");
let no_asiento = ref("");
let fecha_departida = ref("");
let fechahora_venta = ref("");
let cambio = ref(0);
const $q = useQuasar()

async function obtenerInfo() {
  try {
    await TicketStore.getTicket();
    tickets.value = TicketStore.tickets;
    rows.value = TicketStore.tickets;
    console.log(rows)
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  obtenerInfo();
});

const columns = [
  { name: "vendedor_id", label: "Vendedor", field: (row)=>row.vendedor_id.cedula, align:"center" },
  { name: "cliente_id", label: "Cliente", field: (row)=>row.cliente_id.cedula,  align:"center" },
  { name: "bus_id", label: "Bus", field: (row)=>row.bus_id.placa ,  align:"center"},
  { name: "no_asiento", label: "N° Asiento", field: "no_asiento" },
  { name: "fecha_departida", label: "Fecha Partida", field: "fecha_departida" },
  { name: "fechahora_venta", label: "Fecha Venta", field: "fechahora_venta" },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: true,
    align:"center",
    format: (val) => (val ? "Activo" : "Inactivo"),
  },
  {
    name: "createAT",
    label: "Fecha de Creación",
    field: "createAT",
    sortable: true,
    align:"center",
    format: (val) => format(new Date(val), "yyyy-MM-dd"),
  },
  {
    name: "opciones",
    label: "Opciones",
    field: (row) => null,
    sortable: false,
    align:"center"
  },
];


async function InactivarTicket(id) {
  await TicketStore.putTicketInactivar(id);
  obtenerInfo();
}

async function ActivarTicket(id) {
  await TicketStore.putTicketActivar(id);
  obtenerInfo();
}


function generarPDF(ticket) {
 
 const doc = new jsPDF();

 doc.text(`Información del Ticket`, 20, 10);
 doc.text(`Cliente: ${ticket.cliente_id.nombre} - ${ticket.cliente_id.cedula} - ${ticket.cliente_id.telefono}`, 20, 20);
 doc.text(`Vendedor: ${ticket.vendedor_id.nombre} - ${ticket.vendedor_id.telefono}`, 20, 30);
 doc.text(`Bus: ${ticket.bus_id.empresa_asignada} - ${ticket.bus_id.placa} - N°${ticket.bus_id.numero_bus}`, 20, 40);
 doc.text(`Ruta: ${ticket.ruta_id.origen} - ${ticket.ruta_id.destino}`, 20, 50);
 doc.text(`Horario: ${ticket.ruta_id.horario_id.hora_partida} - ${ticket.ruta_id.horario_id.hora_llegada}`, 20, 60);
 doc.text(`N° Asiento: ${ticket.no_asiento}`, 20, 70);
 doc.text(`Fecha de Partida: ${format(new Date(ticket.fecha_departida), "yyyy-MM-dd")}`, 20, 80);


 doc.save(`ticket_${ticket._id}.pdf`);
 
}

</script>