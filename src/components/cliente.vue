<template>
  <div>
    <q-dialog v-model="fixed">
      <q-card class="modal-content">
        <q-card-section color="orange-12" class="row items-center q-pb-none bg-orange-12">
          <div class="text-h6" >{{ text }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />

        <q-card-section style="max-height: 60vh;" @submit.prevent="validar">
      <q-input v-model="cedula" label="Cédula" style="width: 380px" />
      <q-input v-model="nombre" label="Nombre" style="width: 380px" />
      <q-input v-model="telefono" label="Telefono" style="width: 380px" />

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
      <h3 align="center" >Clientes</h3>
      <div class="btn-agregar" style="margin-bottom: 5%; margin-left: -10%; text-align: left;">
        <q-btn color="green" label="Agregar" @click="agregarCliente()" />
      </div>
      <q-table :rows="rows" :columns="columns" row-key="name" style="width:90%" >
        <template v-slot:body-cell-estado="props" >
          <q-td :props="props" >
            <label for="" v-if="props.row.estado == 1" style="color: green;">Activo</label>
            <label for="" v-else style="color: red;">Inactivo</label>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="orange-14" style="margin-right: 5px" @click="EditarCliente(props.row._id)"><q-icon
                name="🖋️" /></q-btn>
            <q-btn color="amber" @click="InactivarCliente(props.row._id)" v-if="props.row.estado == 1"><q-icon
                name="❌" /></q-btn>
            <q-btn color="amber" @click="ActivarCliente(props.row._id)" v-else><q-icon
                name="✔️" /></q-btn>
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
import { useQuasar } from 'quasar'
const ClienteStore = useClienteStore();

let clientes = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref("");
let cedula = ref("");
let nombre = ref();
let telefono = ref("");
let cambio = ref(0);
const $q = useQuasar()
let validacion = ref(true);

async function obtenerInfo() {
  try {
    await ClienteStore.getCliente();
    clientes.value = ClienteStore.clientes;
    rows.value = ClienteStore.clientes.reverse();
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  obtenerInfo();
});

const columns = [
  { name: "cedula", label: "Cedula", field: "cedula", sortable: true, align:"center" },
  { name: "nombre", label: "Nombre", field: "nombre", sortable: true, align:"center" },
  { name: "telefono", label: "Telefono", field: "telefono" , align:"center" },
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
    align:"center",
  },
];

async function agregarCliente() {
  fixed.value = true;
  text.value = "Agregar Cliente";
  cambio.value = 0;
  limpiar();
  errorMessage.value = "";
  validacion.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (error) {
    
    $q.notify({
      type: 'negative',
      color: 'negative',
      message: 'Hubo un error al agregar el cliente',
      timeout: 3000
    });
    console.error(error);
}
}


async function agregarEditarCliente() {
  validar();
  if (validacion.value) {
    try {
      if (cambio.value === 0) {
        await ClienteStore.postCliente({
          cedula: cedula.value,
          nombre: nombre.value,
          telefono: telefono.value,
        });
        
        $q.notify({
          type: 'positive',
          color: 'positive',
          message: 'Cliente agregado exitosamente',
          timeout: 3000
        });
      } else {

        $q.notify({
          type: 'positive',
          color: 'positive',
          message: 'Dato actualizado',
          timeout: 1000
        });

        let id = idCliente.value;
        if (id) {
          await ClienteStore.putCliente(id, {
            cedula: cedula.value,
            nombre: nombre.value,
            telefono: telefono.value,
          });
        }
      }

      limpiar();
      obtenerInfo();
      fixed.value = false;
    } catch (error) {
      $q.notify({
        type: 'negative',
        color: 'negative',
        message: error.response.data.error.errors[0].msg,
        timeout: 6000
      });
      console.error(error);
    }
  }
}


function limpiar() {
  cedula.value = "";
  nombre.value = "";
  telefono.value = "";
}

let idCliente = ref(false);

async function EditarCliente(id) {
  cambio.value = 0 ;
  idCliente.value = true; 
  const clienteSeleccionado = clientes.value.find((cliente) => cliente._id === id);
  if (clienteSeleccionado) {
    idCliente.value = String(clienteSeleccionado._id);
    fixed.value = true;
    text.value = "Editar Cliente";
    cedula.value = clienteSeleccionado.cedula;
    nombre.value = clienteSeleccionado.nombre;
    telefono.value = clienteSeleccionado.telefono;

    errorMessage.value = "";
    // Restablecer la validación al editar
    validacion.value = true;
  }
}



async function InactivarCliente(id) {
  try {
    await ClienteStore.putClienteInactivar(id);
    obtenerInfo();
    $q.notify({ type: 'negative', color: 'negative', message: 'Cliente inactivado exitosamente.' });
  } catch (error) {
    handleError(error);
  }
}

async function ActivarCliente(id) {
  try {
    await ClienteStore.putClienteActivar(id);
    obtenerInfo();
    $q.notify({ type: 'positive', color: 'positive', message: 'Cliente activado exitosamente.' });
  } catch (error) {
    handleError(error);
  }
}


let errorMessage = ref(""); 

async function validar() {
  errorMessage.value = "";
  

  if (!cedula.value && !nombre.value && !telefono.value ) {
    errorMessage.value = "* Por favor rellene todos los campos";
  } else if (!cedula.value) {
    errorMessage.value = "* Ingrese la cédula";
  } else if (!nombre.value) {
    errorMessage.value = "* Ingrese el nombre";
  } else if (cambio.value === 0 && (!telefono.value || telefono.value.length !== 10)) {
    errorMessage.value = "* El teléfono debe tener exactamente 10 dígitos";
  }

  
  setTimeout(() => {
    errorMessage.value = '';
  }, 5000);
  

  validacion.value = errorMessage.value === "";
  idCliente.value = false;
}


</script>

