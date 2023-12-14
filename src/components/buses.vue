<template>
  <div class="container">
    <!-- Modal -->
    <q-dialog v-model="fixed">
      <q-card class="modal-content">
        <q-card-section color="orange-12" class="row items-center q-pb-none bg-orange-12">
          <div class="text-h6">{{ text }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />

        <q-card-section style="max-height: 50vh" @submit.prevent="validar">
          <q-input type="text" v-model="placa" label="Placa" style="width: 300px" @keydown.space.prevent />
          <q-input type="number" v-model="numero_bus" label="Número de Bus" style="width: 300px" @keydown.space.prevent />
          <q-input type="text" v-model="cantidad_asientos" label="Cantidad de Asientos" style="width: 300px"
            @keydown.space.prevent />
          <q-input type="text" v-model="empresa_asignada" label="Empresa Asignada" style="width: 300px"
            @keydown.space.prevent />
          <q-select v-model="conductor_id" :options="optionsConductores" label="Conductores"
            style="width: 320px; margin-bottom:15px;" />
          <div v-if="errorMessage" style="color: red; font-size: medium; font-weight: 600;">{{ errorMessage }}</div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn label="Cerrar" color="orange-10" v-close-popup />
          <q-btn label="Guardar" color="green" @click="editarAgregarBus" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div align="center">
      <h3>Buses</h3>
      <div class="btn-agregar" style="margin-bottom: 5%; margin-left: -10%;">
        <q-btn color="green" label="Agregar" @click="agregarBus" />
      </div>
      <q-table :rows="rows" :columns="columns" row-key="name" style="width:90%">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <label for="" v-if="props.row.estado == 1" style="color: green;">Activo</label>
            <label for="" v-else style="color: red;">Inactivo</label>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="orange-14" text-color="white" icon="🖋️" @click="EditarBus(props.row._id)" />
            <q-btn color="amber" text-color="white" icon="❌" @click="InactivarBus(props.row._id)"
              v-if="props.row.estado == 1" />
            <q-btn color="amber" text-color="white" icon="✔️" @click="ActivarBus(props.row._id)" v-else />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { useBusStore } from "../stores/buses.js";
import { useConductorStore } from "../stores/conductor.js";
import { useQuasar } from "quasar";

const $q = useQuasar();
const busStore = useBusStore();
const conductorStore = useConductorStore();

let buses = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref("");
let placa = ref("");
let numero_bus = ref(null);
let cantidad_asientos = ref("");
let empresa_asignada = ref("");
let conductor_id = ref("");
let cambio = ref(0);
let notification = ref(null);
let optionsConductores = ref([]);

function showNotification(message, type) {
  notification.value = $q.notify({
    message: message,
    type: type,
  });
}

async function obtenerConductores() {
  try {
    await conductorStore.obtenerInfoConductores();
    optionsConductores.value = conductorStore.conductores.map((conductor) => (
      {
        label: `${conductor.cedula} - ${conductor.nombre}`,
        value: String(conductor._id)
      }));
  } catch (error) {
    console.log(error);
  }
}


async function obtenerInfo() {
  try {
    await busStore.obtenerInfoBuses();
    buses.value = busStore.buses;
    rows.value = busStore.buses.reverse();
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  obtenerInfo();
  obtenerConductores();
});

const columns = [
  { name: "placa", label: "Placa", field: "placa", sortable: true, align: "center" },
  { name: "numero_bus", label: "Número de Bus", field: "numero_bus", sortable: true, align: "center" },
  { name: "cantidad_asientos", label: "Cantidad de Asientos", field: "cantidad_asientos", align: "center" },
  { name: "empresa_asignada", label: "Empresa Asignada", field: "empresa_asignada", align: "center" },
  { name: "estado", label: "Estado", field: "estado", sortable: true, align: "center" },
  {
    name: "createAT", label: "Fecha de Creación", field: "createAT", sortable: true, align: "center",
    format: (val) => format(new Date(val), "yyyy-MM-dd"),
  },
  { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, align: "center" },
];

function agregarBus() {
  fixed.value = true;
  text.value = "Agregar Bus";
  cambio.value = 0;
  limpiar();
  errorMessage.value = "";
}

async function editarAgregarBus() {
  validar();
  if (validacion.value === true) {
    if (cambio.value === 0) {
      try {
        showNotification("Please wait...", "positive");
        const conductor = await conductorStore.obtenerConductorPorId(conductor_id.value);
        if (!conductor) {
          throw new Error("Conductor no encontrado");
        }
        await busStore.postBus({
          placa: placa.value,
          numero_bus: numero_bus.value,
          cantidad_asientos: cantidad_asientos.value,
          empresa_asignada: empresa_asignada.value,
          conductor_id: conductor_id.value,
        });
        limpiar();
        showNotification("Bus Agregado", "positive");
        obtenerInfo();
      } catch (error) {
        showNotification(`${error.response.data.error.errors[0].msg}`, "negative");
      }
    } else {
      let id = idBus.value;
      if (id) {
        try {
          showNotification("Please wait...", "positive");
          await busStore.putEditarBus(id, {
            placa: placa.value,
            numero_bus: numero_bus.value,
            cantidad_asientos: cantidad_asientos.value,
            empresa_asignada: empresa_asignada.value,
            conductor_id: conductor_id.value,
          });
          limpiar();
          showNotification("Bus Actualizado", "positive");
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
  placa.value = "";
  numero_bus.value = null;
  cantidad_asientos.value = "";
  empresa_asignada.value = "";
}

let idBus = ref("");

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
    conductor_id.value = String(busSeleccionado.conductor_id);

    try {
      const responseConductor = await axios.get(`/conductor/conductor/${conductor_id.value}`);
      const conductor = responseConductor.data.conductor;

      if (conductor) {
        conductor_id.label = `${conductor.nombre} ${conductor.apellido}`;
      } else {
        throw new Error("Conductor no encontrado");
      }
    } catch (error) {
      showNotification(`${error.response.data.error.errors[0].msg}`, "negative");
    }
  }
}


async function InactivarBus(id) {
  try {
    await busStore.putInactivarBus(id);
    obtenerInfo();
    showNotification("Bus Inactivado exitosamente.", "negative");
  } catch (error) {
    handleError(error);
  }
}

async function ActivarBus(id) {
  try {
    await busStore.putActivarBus(id);
    obtenerInfo();
    showNotification("Bus Activado exitosamente.", "positive");
  } catch (error) {
    handleError(error);
  }
}

let validacion = ref(true);
let errorMessage = ref("");

async function validar() {
  errorMessage.value = "";
  if (!placa.value || !numero_bus.value || !cantidad_asientos.value || !empresa_asignada.value) {
    errorMessage.value = "* Por favor rellene todos los campos";
  } else if (!placa.value) {
    errorMessage.value = "* Ingrese la Placa";
  } else if (!numero_bus.value) {
    errorMessage.value = "* Ingrese el número del bus";
  } else if (!cantidad_asientos.value) {
    errorMessage.value = "* Ingrese la cantidad de asientos";
  } else if (!empresa_asignada.value) {
    errorMessage.value = "* Ingrese el nombre de la empresa";
  }
  setTimeout(() => {
    errorMessage.value = '';
  }, 5000);
}
</script>
