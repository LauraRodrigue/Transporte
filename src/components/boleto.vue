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
                name="cancel" /></q-btn>
            <q-btn color="amber" @click="ActivarTicket(props.row._id)" v-else><q-icon
                name="check_circle_outline" /></q-btn>
          </q-td>
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
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  obtenerInfo();
});

const columns = [
  { name: "vendedor_id", label: "Vendedor", field: "vendedor_id", sortable: true,align:"center" },
  { name: "cliente_id", label: "Cliente", field: "cliente_id", sortable: true,align:"center" },
  { name: "bus_id", label: "Bus", field: "bus_id",align:"center" },
  { name: "no_asiento", label: "N° Asiento", field: "no_asiento",align:"center" },
  { name: "fecha_departida", label: "Fecha Partida", field: "fecha_departida",align:"center" },
  { name: "fechahora_venta", label: "Fecha Venta", field: "fechahora_venta",align:"center"},
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
</script>