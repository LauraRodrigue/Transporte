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

        <q-card-section style="max-height: 50vh" class="scroll">
          <q-input type="text" v-model="cedula" label="Cedula" style="width: 300px" />
          <q-input type="text" v-model="nombre" label="Nombre" style="width: 300px" />
          <div class="q-pa" style="width: 300px;">
            <div class="q-gutter">
              <q-select v-model="bus" :options="options" label="ID Bus" />
            </div>
          </div>
          <q-input type="text" v-model="experiencia" label="Experiencia" style="width: 300px" />
          <q-input type="text" v-model="telefono" label="Telefono" style="width: 300px" />
        </q-card-section>
        <q-separator />
        <div class="error">{{ errorMessage }}</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="orange-10" v-close-popup />
          <q-btn label="Guardar" color="green" @click="editarAgregarConductor()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div align="center">
      <h3>Conductores</h3>
      <div class="btn-agregar" style="margin-bottom: 5%; margin-left: -10%;">
        <q-btn color="green" label="Agregar " @click="agregarConductor()" />
      </div>
      <q-table :rows="rows" :columns="columns" row-key="name" style="width:90%">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <label for="" v-if="props.row.estado == 1" style="color: green">Activo</label>
            <label for="" v-else style="color: red">Inactivo</label>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="orange-14" text-color="white" icon="edit" @click="EditarConductor(props.row._id)" />
            <q-btn color="amber" text-color="white" icon="cancel" @click="InactivarConductor(props.row._id)"
              v-if="props.row.estado == 1" />
            <q-btn color="amber" text-color="white" icon="check_circle_outline" @click="ActivarConductor(props.row._id)"
              v-else />
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
let nombre = ref();
let bus = ref("")
let experiencia = ref("");
let telefono = ref("");
let cambio = ref(0);

// const cantidad_asientos = ref("");
// const empresa_asignada = ref("");

async function obtenerInfo() {
  try {
    await conductorStore.obtenerInfoConductores();
    conductores.value = conductorStore.conductores;
    rows.value = conductorStore.conductores;
  } catch (error) {
    console.log(error);
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
  { name: "cedula", label: "Cedula", field: "cedula", sortable: true },
  { name: "nombre", label: "Nombre", field: "nombre", sortable: true },
  { name: "id_bus", label: "Placa", field: (row) => row.id_bus.placa },
  { name: "id_bus", label: "Empresa Bus", field: (row) => row.id_bus.empresa_asignada },
  { name: "id_bus", label: "Numero Bus", field: (row) => row.id_bus.numero_bus },
  { name: "experiencia", label: "Experiencia", field: "experiencia" },
  { name: "telefono", label: "Telefono", field: "telefono" },
  { name: "estado", label: "Estado", field: "estado", sortable: true },
  { name: "createAT", label: "Fecha de Creación", field: "createAT", sortable: true, format: (val) => format(new Date(val), "yyyy-MM-dd"), },
  { name: "opciones", label: "Opciones", sortable: false, },
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
  if (validacion.value === true) {
    if (cambio.value === 0) {
      try {
        showDefault();
        await conductorStore.postConductor({
          cedula: cedula.value,
          nombre: nombre.value,
          id_bus: bus._rawValue.value,
          experiencia: experiencia.value,
          telefono: telefono.value
        });
        if (notification) {
          notification();
        }
        limpiar();
        $q.notify({
          spinner: false,
          message: "Conductor Agregado",
          timeout: 2000,
          type: "positive",
        });
        obtenerInfo();
      } catch (error) {
        if (notification) {
          notification();
        }
        $q.notify({
          spinner: false,
          message: `${error.response.data.error.errors[0].msg}`,
          timeout: 2000,
          type: "negative",
        });
      }
    } else {
      let id = idConductor.value;
      if (id) {
        try {
          showDefault();
          await conductorStore.putEditarConductor(id, {
            cedula: cedula.value,
            nombre: nombre.value,
            id_bus: bus._rawValue.value,
            experiencia: experiencia.value,
            telefono: telefono.value
          });
          if (notification) {
            notification();
          }
          limpiar();
          $q.notify({
            spinner: false,
            message: "Conductor Actualizado",
            timeout: 2000,
            type: "positive",
          });
          obtenerInfo();
          fixed.value = false;
        } catch (error) {
          if (notification) {
            notification();
          }
          $q.notify({
            spinner: false,
            message: `${error.response.data.error.errors[0].msg}`,
            timeout: 2000,
            type: "negative",
          });
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
    cedula.value = conductorSeleccionado.cedula;
    nombre.value = conductorSeleccionado.nombre;
    bus.value = `${conductorSeleccionado.id_bus.placa} - ${conductorSeleccionado.id_bus.empresa_asignada} - ${conductorSeleccionado.id_bus.numero_bus}`
    experiencia.value = conductorSeleccionado.experiencia;
    telefono.value = conductorSeleccionado.telefono;
  }
}

async function InactivarConductor(id) {
  try {
    showDefault();
    await conductorStore.putInactivarConductor(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Conductor Inactivado",
      timeout: 2000,
      type: 'positive',
    });
    obtenerInfo()
  } catch (error) {
    if (notification) {
      notification()
    };
    $q.notify({
      spinner: false,
      message: `${error.response.data.error.errors[0].msg}`,
      timeout: 2000,
      type: 'negative',
    });
  }
}

async function ActivarConductor(id) {
  try {
    showDefault();
    await conductorStore.putActivarConductor(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Conductor Activado",
      timeout: 2000,
      type: 'positive',
    });
    obtenerInfo()
  } catch (error) {
    if (notification) {
      notification()
    };
    $q.notify({
      spinner: false,
      message: `${error.response.data.error.errors[0].msg}`,
      timeout: 2000,
      type: 'negative',
    });
  }
}


let errorMessage = ref("");

const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: "Please wait...",
    timeout: 0,
  });
};

let validacion = ref(false);
let notification = ref(null);
async function validar() {

  if (!cedula.value && !nombre.value && !bus.value && !experiencia.value && !telefono.value) {
    errorMessage.value = "Por favor rellene los campos";
  } else if (!cedula.value) {
    errorMessage.value = "Ingrese la Cedula";
  } else if (!nombre.value) {
    errorMessage.value = "Ingrese el Nombre";
  } else if (!bus.value) {
    errorMessage.value = "Seleccione un Bus";
  } else if (!experiencia.value) {
    errorMessage.value = "Digite la experiencia, por ejemplo (4 años)"
  } else if (!telefono.value) {
    errorMessage.value = "Ingrese el Telefono";
  } else if (telefono.value.length !== 10) {
    errorMessage.value = "El telefono debe tener 10 Digitos";
  } else {
    errorMessage.value = "";
    validacion.value = true;
  }
}
</script>
  
<style scoped>
.modal-content {
  width: 400px;
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
</style>