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

        <q-card-section style="max-height: 60vh;" @submit.prevent="validar">
          <q-input type="number" v-model="cedula" label="Cédula" style="width: 380px" />
          <q-input  type="text" v-model="nombre" label="Nombre" style="width: 380px"  />
          <q-input  type="number" v-model="telefono" label="Telefono" style="width: 380px"  />

          <div v-if="errorMessage" style="color: red; font-size:medium; font-weight: 600;">{{ errorMessage }}</div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center">
          <q-btn color="orange-10" label="CERRAR" v-close-popup />
          <q-btn color="green" label="GUARDAR" @click="agregarEditarCliente" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div align="center">
      <h2 align="center">Clientes</h2>
      <q-spinner :size="50" :thickness="4" :color="loading ? 'primary' : 'transparent'" v-if="loading" />
      <div class="btn-agregar" style="margin-bottom: 5%; margin-left: -10%; text-align: right;">
        <q-btn color="green" label="Agregar" @click="agregarCliente()" />
      </div>
      <q-table :rows="rows" :columns="columns" row-key="name" style="width:90%">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <label v-if="props.row.estado == 1" style="color: green;">Activo</label>
            <label v-else style="color: red;">Inactivo</label>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="orange-14" style="margin-right: 5px" @click="EditarCliente(props.row._id)"><q-icon name="🖋️" /></q-btn>
            <q-btn color="amber" @click="InactivarCliente(props.row._id)" v-if="props.row.estado == 1"><q-icon name="❌" /></q-btn>
            <q-btn color="amber" @click="ActivarCliente(props.row._id)" v-else><q-icon name="✔️" /></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { useClienteStore } from "../stores/clientes.js";
import { useQuasar } from 'quasar'

const ClienteStore = useClienteStore();
const $q = useQuasar();

let clientes = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref("");
let cedula = ref("");
let nombre = ref("");
let telefono = ref("");
let cambio = ref(0);
let idCliente = ref("");
let loading = ref(false);


function showNotification(message, type) {
  $q.notify({
    message: message,
    type: type,
  });
}

async function obtenerInfo() {
  try {
    loading.value = true; 
    await ClienteStore.obtenerInfoClientes();
    clientes.value = ClienteStore.clientes;
    rows.value = ClienteStore.clientes.reverse();
  } catch (error) {
    console.log(error);
  }finally {
    loading.value = false; // Indicar que la carga ha finalizado
  }
}

onMounted(async () => {
  obtenerInfo();
});

const columns = [
  { name: "cedula", label: "Cedula", field: "cedula", sortable: true, align: "left" },
  { name: "nombre", label: "Nombre", field: "nombre", sortable: true, align: "left" },
  { name: "telefono", label: "Telefono", field: "telefono", align: "left" },
  { name: "estado", label: "Estado", field: "estado", sortable: true, align: "left", format: (val) => (val ? "Activo" : "Inactivo") },
  { name: "createAT", label: "Fecha de Creación", field: "createAT", sortable: true, align: "left", format: (val) => format(new Date(val), "yyyy-MM-dd") },
  { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, align: "center" },
];

function agregarCliente() {
  fixed.value = true;
  text.value = "Agregar Cliente";
  cambio.value = 0;
  limpiar();
  // Restablecer el mensaje de error al agregar
  errorMessage.value = "";
  // Restablecer la validación al agregar
  validacion.value = true;
}

async function agregarEditarCliente() {
  validar();
  if (validacion.value) {
    if (cambio.value === 0) {
      try {
        showNotification("Please wait...", "positive");
        await ClienteStore.postCliente({
          cedula: cedula.value.trim(),
          nombre: nombre.value.trim(),
          telefono: telefono.value.trim(),
        });
        limpiar();
        showNotification("Cliente Agregado", "positive");
        obtenerInfo();
      } catch (error) {
        showNotification(`${error.response.data.error.errors[0].msg}`, "negative");
      }
    } else {
      let id = idCliente.value;
      if (id) {
        try {
          showNotification("Please wait...", "positive");
          await ClienteStore.putCliente(id, {
            cedula: cedula.value.trim(),
            nombre: nombre.value.trim(),
            telefono: telefono.value.trim(),
          });
          limpiar();
          showNotification("Cliente Actualizado", "positive");
          obtenerInfo();
          fixed.value = false;
        } catch (error) {
          showNotification(`${error.response.data.error.errors[0].msg}`, "negative");
        }
      }
    }
  }
}

function limpiar() {
  cedula.value = "";
  nombre.value = "";
  telefono.value = "";
}

function EditarCliente(id) {
  cambio.value = 1;
  const clienteSeleccionado = clientes.value.find((cliente) => cliente._id === id);
  if (clienteSeleccionado) {
    idCliente.value = String(clienteSeleccionado._id);
    fixed.value = true;
    text.value = "Editar Cliente";
    cedula.value = clienteSeleccionado.cedula.trim();
    nombre.value = clienteSeleccionado.nombre.trim();
    telefono.value = clienteSeleccionado.telefono.trim();
    // Restablecer el mensaje de error al editar
    errorMessage.value = "";
    // Restablecer la validación al editar
    validacion.value = true;
  }
}



async function InactivarCliente(id) {
  try {
    await ClienteStore.putClienteInactivar(id);
    obtenerInfo();
    showNotification("Cliente Inactivado exitosamente.", "negative");
  } catch (error) {
    handleError(error);
  }
}

async function ActivarCliente(id) {
  try {
    await ClienteStore.putClienteActivar(id);
    obtenerInfo();
    showNotification("Cliente Activado exitosamente.", "positive");
  } catch (error) {
    handleError(error);
  }
}

let validacion = ref(false);
let errorMessage = ref("");

async function validar() {
  errorMessage.value = "";

  if (!cedula.value || !nombre.value || !telefono.value) {
    errorMessage.value = "* Por favor rellene todos los campos";
  } else if (!cedula.value) {
    errorMessage.value = "* Ingrese la cédula";
  } else if (!nombre.value) {
    errorMessage.value = "* Ingrese el nombre";
  } else if (!telefono.value) {
    errorMessage.value = "* Ingrese el teléfono";
  } else if (telefono.value.length ===11) {
    errorMessage.value = "* El teléfono debe tener 10 dígitos";
  }

  setTimeout(() => {
    errorMessage.value = '';
  }, 5000);

  validacion.value = errorMessage.value === "";
}
</script>
