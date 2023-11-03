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
          <q-input
            v-model="cedula"
            label="Cédula"
            style="width: 400px"
          />
          <q-input
            v-model="nombre"
            label="Nombre"
            style="width: 400px"
          />
          <q-input 
          v-model="telefono" 
          label="Telefono" 
          style="width: 400px" 
          />
        </q-card-section>
    

        <q-separator />

        <q-card-actions align="center">
          <q-btn color="orange-10" label="CERRAR" v-close-popup />
          <q-btn color="green" label="GUARDAR" @click="agregarEditarCliente" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div>
      <h3 align="center">Clientes</h3>
      <div class="btn-agregar" style="margin-bottom: 5%">
        <q-btn color="green" label="Agregar" @click="agregarCliente()" />
      </div>
      <q-table :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <label for="" v-if="props.row.estado == 1">Activo</label>
            <label for="" v-else>Inactivo</label>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn
              color="orange-14"
              style="margin-right: 5px"

              @click="EditarCliente(props.row._id)"
              ><q-icon name="edit"
            /></q-btn>
            <q-btn
              color="amber"
              @click="InactivarCliente(props.row._id)"
              v-if="props.row.estado == 1"
              ><q-icon name="cancel"
            /></q-btn>
            <q-btn color="amber" @click="ActivarCliente(props.row._id)" v-else
              ><q-icon name="check_circle_outline"
            /></q-btn>
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
import { useClienteStore } from "../stores/clientes.js";
const ClienteStore = useClienteStore();

let clientes = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref("");
let cedula = ref("");
let nombre = ref();
let telefono = ref("");
let cambio = ref(0);

async function obtenerInfo() {
  try {
    await ClienteStore.getCliente();
    clientes.value = ClienteStore.clientes;
    rows.value = ClienteStore.clientes;
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  obtenerInfo();
});

const columns = [
  { name: "cedula", label: "Cedula", field: "cedula", sortable: true },
  { name: "nombre", label: "Nombre", field: "nombre", sortable: true },
  { name: "telefono", label: "Telefono", field: "telefono" },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: true,
    format: (val) => (val ? "Activo" : "Inactivo"),
  },
  {
    name: "createAT",
    label: "Fecha de Creación",
    field: "createAT",
    sortable: true,
    format: (val) => format(new Date(val), "yyyy-MM-dd"),
  },
  {
    name: "opciones",
    label: "Opciones",
    field: (row) => null,
    sortable: false,
  },
];

function agregarCliente() {
  fixed.value = true;
  text.value = "Agregar Cliente";
  cambio.value = 0;
  limpiar();
}

async function agregarEditarCliente() {
  if (cambio.value === 0) {
    await ClienteStore.postCliente({
      cedula: cedula.value,
      nombre: nombre.value,
      telefono: telefono.value,
    });
    limpiar();
    obtenerInfo();
    fixed.value = false;
  } else {
    let id = idCliente.value;
    if (id) {
      await ClienteStore.putCliente(id, {
        cedula: cedula.value,
        nombre: nombre.value,
        telefono: telefono.value,
      });
      limpiar();
      obtenerInfo();
      fixed.value = false;
    }
  }
}

function limpiar() {
  cedula.value = "";
  nombre.value = "";
  telefono.value = "";
}

let idCliente = ref("");
async function EditarCliente(id) {
    cambio.value = 1;
    const clienteSeleccionado = clientes.value.find((cliente) => cliente._id === id);
    if (clienteSeleccionado) {
        idCliente.value = String(clienteSeleccionado._id);
        fixed.value = true;
        text.value = "Editar Cliente";
        cedula.value = clienteSeleccionado.cedula;
        nombre.value = clienteSeleccionado.nombre;
        telefono.value = clienteSeleccionado.telefono;
    }
}

async function InactivarCliente(id) {
  await ClienteStore.putClienteInactivar(id);
  obtenerInfo();
}

async function ActivarCliente(id) {
  await ClienteStore.putClienteActivar(id);
  obtenerInfo();
}
</script>


  
<style scoped>
.modal-content {
  width: 450px;
}

.botones button {
  margin: 2px;
}

.btn-agregar {
  width: 100%;
  margin-bottom: 5px;
  display: flex;
  justify-content: flex-end
}

.volver {
  width: 100%;
  margin-top: 5px;
}
.contenedor{
  width: 100%;
  text-align: center;
  place-items: center;
  justify-content: center;
}
.cont{
  margin: auto;
  max-width: 1300px;
}
</style>
  