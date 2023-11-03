<template>
  <div>
    <q-dialog v-model="fixed">
      <q-card class="modal-content">
        <q-card-section color="orange-12" class="row items-center q-pb-none bg-orange-12">
          <div class="text-h6">{{ text }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <q-input v-model="placa" label="Placa" style="width: 300px;" />
          <q-input v-model="numero_bus" label="Número de Bus" style="width: 300px;" />

          <q-input v-model="cantidad_asientos" label="Cantidad de Asientos" style="width: 300px;" />
          <q-input v-model="empresa_asignada" label="Empresa Asignada" style="width: 300px;" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="center">
          <q-btn flat label="Cerrar" color="orange-10" v-close-popup />
          <q-btn flat label="Guardar" color="green" @click="agregarEditarBus" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div>
      <h3 align="center">Buses</h3>
      <div class="btn-agregar" style="margin-bottom: 5%;">
        <q-btn color="primary" label="Agregar" @click="agregarBus()" />
      </div>
      <q-input v-model="searchPlaca" label="Buscar por Placa" style="width: 300px; border-radius: 5
          px; background-color: azure; position:relative; left: 80%;" />

      <q-table style="width: 1300px; margin-top: 10px" title="Buses" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <label for="" v-if="props.row.estado == 1">Activo</label>
            <label for="" v-else>Inactivo</label>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="orange-14" style="margin-right: 5px;" text-color="black" @click="EditarBus(props.row._id)"><q-icon
                name="edit" /></q-btn>
            <q-btn color="green-4" glossy @click="InactivarBus(props.row._id)" v-if="props.row.estado == 1"><q-icon
                name="toggle_on" /></q-btn>
            <q-btn color="red-4" glossy @click="ActivarBus(props.row._id)" v-else><q-icon name="toggle_off" /></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import { useBusStore } from '../stores/buses.js';
const busStore = useBusStore()

let buses = ref([]);
let rows = ref([]);
let fixed = ref(false)
let text = ref('')
let placa = ref('');
let numero_bus = ref();
let cantidad_asientos = ref('');
let empresa_asignada = ref('');
let cambio = ref(0)

async function obtenerInfo() {
  try {
    await busStore.getBuses();
    buses.value = busStore.buses;
    rows.value = busStore.buses;
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  obtenerInfo()
});

const columns = [
  { name: 'placa', label: 'Placa', field: 'placa', sortable: true },
  { name: 'numero_bus', label: 'Número de Bus', field: 'numero_bus', sortable: true },
  { name: 'cantidad_asientos', label: 'Cantidad de Asientos', field: 'cantidad_asientos' },
  { name: 'empresa_asignada', label: 'Empresa Asignada', field: 'empresa_asignada' },
  { name: 'estado', label: 'Estado', field: 'estado', sortable: true, format: (val) => (val ? 'Activo' : 'Inactivo') },
  {
    name: 'createAT', label: 'Fecha de Creación', field: 'createAT', sortable: true,
    format: (val) => format(new Date(val), 'yyyy-MM-dd')
  },
  {
    name: 'opciones', label: 'Opciones',
    field: row => null,
    "sortable": false,
  },
];

function agregarBus() {
  fixed.value = true;
  text.value = "Agregar Bus";
  cambio.value = 0
  limpiar();
}

async function agregarEditarBus() {
  if (cambio.value === 0) {
    await busStore.postBus({
      placa: placa.value,
      numero_bus: numero_bus.value,
      cantidad_asientos: cantidad_asientos.value,
      empresa_asignada: empresa_asignada.value,
    });
    limpiar();
    obtenerInfo();
    fixed.value = false;
  } else {
    let id = idBus.value;
    if (id) {
      await busStore.putEditarBus(id, {
        placa: placa.value,
        numero_bus: numero_bus.value,
        cantidad_asientos: cantidad_asientos.value,
        empresa_asignada: empresa_asignada.value,
      });
      limpiar();
      obtenerInfo();
      fixed.value = false;
    }
  }
}

function limpiar() {
  placa.value = "";
  numero_bus.value = "";
  cantidad_asientos.value = "";
  empresa_asignada.value = "";
}

let idBus = ref('');
async function EditarBus(id) {
  cambio.value = 1;
  const busSeleccionado = buses.value.find((bus) => bus._id === id);
  if (busSeleccionado) {
    idBus.value = String(busSeleccionado._id);
    fixed.value = true;
    text.value = "Editar Bus";
    placa.value = busSeleccionado.placa;
    numero_bus.value = busSeleccionado.numero_bus;
    cantidad_asientos.value = busSeleccionado.cantidad_asientos;
    empresa_asignada.value = busSeleccionado.empresa_asignada;
  }
}

async function InactivarBus(id) {
  await busStore.putInactivarBus(id);
  obtenerInfo();
}

async function ActivarBus(id) {
  await busStore.putActivarBus(id);
  obtenerInfo();
}
</script>


<style scoped>
.q-table-container .q-td.opciones {
  text-align: center;
}

.q-btn.opcion-btn {
  margin-right: 5px;
}
</style>