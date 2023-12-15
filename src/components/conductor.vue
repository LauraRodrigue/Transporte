<template>
  <div class="container">
    <!-- Modal -->
    <q-dialog v-model="fixed">
      <q-card class="modal-content">
        <q-card-section color="orange-12" class="row items-center q-pb-none bg-orange-12" style="color: black">
          <div class="text-h6">{{ text }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />

        <q-card-section style="max-height: 50vh">
          <q-input type="number" v-model="cedula" label="Cedula" style="width: 300px"  />          
          <q-input type="text" v-model="nombre" label="Nombre" style="width: 300px"  />
          <q-input type="number" v-model="experiencia" label="Experiencia" style="width: 300px" @keypress="validarTecla" />
          <q-input type="number" v-model="telefono" label="Telefono" style="width: 300px"   />

          <div v-if="errorMessage" style="color: red; font-size: medium; font-weight: 600;">{{ errorMessage }}</div>
        </q-card-section>
        <q-separator />

        <q-card-actions align= "right"> 
          <q-btn label="Cerrar" color="orange-10" v-close-popup />
          <q-btn label="Guardar" color="green" @click="editarAgregarConductor" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div align="center">
      <h2>Conductores</h2>
      <q-spinner :size="50" :thickness="4" :color="loading ? 'primary' : 'transparent'" v-if="loading" />
      <div class="btn-agregar" style="margin-bottom: 5%; margin-left: -10%;">
        <q-btn color="green" label="Agregar " @click="agregarConductor" />
      </div>
      <q-table :rows="rows" :columns="columns" row-key="name" style="width: 90%;" table-class="jose">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <label v-if="props.row.estado == 1" style="color: green">Activo</label>
            <label v-else style="color: red">Inactivo</label>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props" >
          <q-td :props="props" class="botones">
            <q-btn color="orange-14" text-color="white" icon="🖋️" @click="EditarConductor(props.row._id)" />
            <q-btn color="amber" text-color="white" icon="❌" @click="InactivarConductor(props.row._id)" v-if="props.row.estado == 1" />
            <q-btn color="amber" text-color="white" icon="✔️" @click="ActivarConductor(props.row._id)" v-else />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { useBusStore } from "../stores/buses.js";
import { useConductorStore } from "../stores/conductor.js";
import { useQuasar } from 'quasar'

const busStore = useBusStore();
const conductorStore = useConductorStore();
const $q = useQuasar();

let conductores = ref([]);
let rows = ref([]);
let fixed = ref(false);
let options = ref([])
let text = ref("");
let cedula = ref("");
let nombre = ref("");
let bus = ref("");
let experiencia = ref("");
let telefono = ref("");
let cambio = ref(0);
let notification = ref(null);
let loading = ref(false);

function showNotification(message, type) {
  notification.value = $q.notify({
    message: message,
    type: type,
  });
}

async function obtenerInfo() {
  try {
    loading.value = true; 
    await conductorStore.obtenerInfoConductores();
    conductores.value = conductorStore.conductores;
    rows.value = conductorStore.conductores.reverse();
  } catch (error) {
    console.log(error);
  }finally {
    loading.value = false; // Indicar que la carga ha finalizado
  }
}

async function obtenerBuses() {
  try {
    await busStore.obtenerInfoBuses();
    options.value = busStore.buses.map((bus) => (
      {
        label: `${bus.placa} - ${bus.empresa_asignada} - ${bus.numero_bus}`,
        value: String(bus._id)
      }));
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  obtenerInfo();
});

const columns = [
  { name: "cedula", label: "Cedula", field: "cedula", sortable: true, align: "left" },
  { name: "nombre", label: "Nombre", field: "nombre", sortable: true, align: "left" },
  { name: "experiencia", label: "Experiencia", field: "experiencia", align: "center" },
  { name: "telefono", label: "Telefono", field: "telefono", align: "left" },
  { name: "estado", label: "Estado", field: "estado", sortable: true, align: "left" },
  { name: "createAT", label: "Fecha de Creación", field: "createAT", sortable: true, align: "left", format: (val) => format(new Date(val), "yyyy-MM-dd") },
  { name: "opciones", label: "Opciones", sortable: false, align: "center" },
];

function agregarConductor() {
  obtenerBuses();
  fixed.value = true;
  text.value = "Agregar Conductor";
  cambio.value = 0;
  limpiar();
}

async function editarAgregarConductor() {
  validar();
  if (validacion.value) {
    if (cambio.value === 0) {
      try {
        showNotification("Please wait...", "positive");
        await conductorStore.postConductor({
          cedula: cedula.value.trim(),
          nombre: nombre.value.trim(),
          id_bus: bus.value.trim(),
          experiencia: experiencia.value.trim(),
          telefono: telefono.value.trim()
        });
        limpiar();
        showNotification("Conductor Agregado", "positive");
        obtenerInfo();
      } catch (error) {
        showNotification(`${error.response.data.error.errors[0].msg}`, "negative");
      }
    } else {
      let id = idConductor.value;
      if (id) {
        try {
          showNotification("Please wait...", "positive");
          await conductorStore.putEditarConductor(id, {
            cedula: cedula.value.trim(),
            nombre: nombre.value.trim(),
            id_bus: bus.value.trim(),
            experiencia: experiencia.value.trim(),
            telefono: telefono.value.trim()
          });
          limpiar();
          showNotification("Conductor Actualizado", "positive");
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
  bus.value = "";
  experiencia.value = "";
  telefono.value = "";
}

let idConductor = ref("");

async function EditarConductor(id) {
  obtenerBuses()
  cambio.value = 1;
  const conductorSeleccionado = conductores.value.find((conductor) => conductor._id === id);
  if (conductorSeleccionado) {
    idConductor.value = String(conductorSeleccionado._id);
    fixed.value = true;
    text.value = "Editar Conductor";
    cedula.value = conductorSeleccionado.cedula.trim();
    nombre.value = conductorSeleccionado.nombre.trim();
    bus.value = conductorSeleccionado.id_bus.trim();
    experiencia.value = conductorSeleccionado.experiencia.trim();
    telefono.value = conductorSeleccionado.telefono.trim();
  }
}

async function InactivarConductor(id) {
  try {
    await conductorStore.putInactivarConductor(id);
    obtenerInfo();
    showNotification("Conductor Inactivado exitosamente.", "negative");
  } catch (error) {
    handleError(error);
  }
}

async function ActivarConductor(id) {
  try {
    await conductorStore.putActivarConductor(id);
    obtenerInfo();
    showNotification("Conductor Activado exitosamente.", "positive");
  } catch (error) {
    handleError(error);
  }
}

function validarTecla(event) {
  // Obtener el código de la tecla presionada
  const keyCode = event.keyCode;

  // Permitir teclas de navegación y números positivos
  if (
    (keyCode >= 48 && keyCode <= 57) || // Números del teclado principal
    (keyCode >= 96 && keyCode <= 105) || // Números del teclado numérico
    keyCode === 8 || // Retroceso
    keyCode === 9 || // Tabulador
    keyCode === 13 || // Enter
    keyCode === 37 || // Flecha izquierda
    keyCode === 39 // Flecha derecha
  ) {
    // No hacer nada si la tecla es permitida
  } else {
    // Prevenir la entrada de otras teclas, incluyendo el signo negativo
    event.preventDefault();
  }
}

let validacion = ref(false);
let errorMessage = ref("");

async function validar() {
  errorMessage.value = "";

  if (!cedula.value & !nombre.value  & !experiencia.value & !telefono.value) {
    errorMessage.value = "* Por favor Rellene todos los campos ";
  } else if (!cedula.value) {
    errorMessage.value = "* Ingrese la Cedula";
  } else if (!nombre.value) {
    errorMessage.value = "* Ingrese el Nombre";
  } else if (!experiencia.value) {
    errorMessage.value = "* Digite la experiencia, por ejemplo (4 años)";
  } else if (!telefono.value) {
    errorMessage.value = "* Ingrese el Telefono";
  } else if (telefono.value.length !== 10) {
    errorMessage.value = "* El telefono debe tener 10 Digitos";
  }

  setTimeout(() => {
    errorMessage.value = '';
  }, 5000);

  validacion.value = errorMessage.value === "";
}
</script>
