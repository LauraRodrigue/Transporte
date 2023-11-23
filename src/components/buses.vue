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

        <q-card-section style="max-height: 50vh" class="scroll">
          <q-input type="text" v-model="placa" label="Placa" style="width: 300px" />
          <q-input type="number" v-model="numero_bus" label="Número de Bus" style="width: 300px" />
          <q-input type="text" v-model="cantidad_asientos" label="Cantidad de Asientos" style="width: 300px" />
          <q-input type="text" v-model="empresa_asignada" label="Empresa Asignada" style="width: 300px" />
          <div class="q-pa" style="width: 300px;">
            <div class="q-gutter">
              <q-select v-model="ruta" :options="options" label="Rutas" />
            </div>
          </div>
        </q-card-section>

        <q-separator />
        <div class="error">{{ errorMessage }}</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="orange-10" v-close-popup />
          <q-btn label="Guardar" color="green" @click="editarAgregarBus()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div align="center">
      <h3>Buses</h3>
      <div class="btn-agregar" style="margin-bottom: 5%; margin-left: -10%;">
        <q-btn color="green" label="Agregar" @click="agregarBus()" />
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
            <q-btn color="orange-14" text-color="white" icon="edit" @click="EditarBus(props.row._id)" />
            <q-btn color="amber" text-color="white" icon="cancel" @click="InactivarBus(props.row._id)"
              v-if="props.row.estado == 1" />
            <q-btn color="amber" text-color="white" icon="check_circle_outline" @click="ActivarBus(props.row._id)"
              v-else />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>
 
<script setup>
import { ref, onMounted, watch } from "vue";
import { format } from "date-fns";
import { useBusStore } from "../stores/buses.js";
import { useRutaStore } from "../stores/ruta.js";
import { useQuasar } from "quasar";

const $q = useQuasar();
const busStore = useBusStore();
const rutaStore = useRutaStore()

let buses = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref("");
let ruta = ref("")
let options = ref([])
let placa = ref("");
let numero_bus = ref();
let cantidad_asientos = ref("");
let empresa_asignada = ref("");
// const cantidad_asientos = ref("");
// const empresa_asignada = ref("");
let cambio = ref(0);

async function obtenerInfo() {
  try {
    await busStore.obtenerInfoBuses();
    buses.value = busStore.buses;
    rows.value = busStore.buses;
  } catch (error) {
    console.log(error);
  }
}

// watch(ruta, (newValue, oldValue) => {
//   console.log(ruta._rawValue.value);
// });

async function obtenerRutas() {
  try {
    await rutaStore.obtenerInfoRutas();
    options.value = rutaStore.rutas.map((ruta) => (
      {
        label: `${ruta.precio} - ${ruta.origen} - ${ruta.destino}`,
        value: String(ruta._id)
      }));
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  obtenerInfo();
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
  obtenerRutas()
  fixed.value = true;
  text.value = "Agregar Bus";
  cambio.value = 0;
}

async function editarAgregarBus() {
  validar();
  if (validacion.value === true) {
    if (cambio.value === 0) {
      try {
        showDefault();
        await busStore.postBus({
          placa: placa.value,
          numero_bus: numero_bus.value,
          cantidad_asientos: cantidad_asientos.value,
          empresa_asignada: empresa_asignada.value,
          ruta_id: ruta._rawValue.value,
        });
        if (notification) {
          notification();
        }
        limpiar();
        $q.notify({
          spinner: false,
          message: "Bus Agregado",
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
      let id = idBus.value;
      if (id) {
        try {
          await busStore.putEditarBus(id, {
            placa: placa.value,
            numero_bus: numero_bus.value,
            cantidad_asientos: cantidad_asientos.value,
            empresa_asignada: empresa_asignada.value,
            ruta_id: ruta._rawValue.value,
          });
          if (notification) {
            notification();
          }
          limpiar();
          $q.notify({
            spinner: false,
            message: "Bus Actualizado",
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
  placa.value = "";
  numero_bus.value = "";
  cantidad_asientos.value = "";
  empresa_asignada.value = "";
  ruta.value = ""
}

let idBus = ref("");
async function EditarBus(id) {
  obtenerRutas()
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
    ruta.value = {
      label: `${busSeleccionado.ruta_id.origen} - ${busSeleccionado.ruta_id.destino}`,
      value: String(busSeleccionado.ruta_id._id)
    }
  }
}

async function InactivarBus(id) {
  try {
    showDefault();
    await busStore.putInactivarBus(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Bus Inactivado",
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

async function ActivarBus(id) {
  try {
    showDefault();
    await busStore.putActivarBus(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Bus Activado",
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

  if (!placa.value && !numero_bus.value && !cantidad_asientos.value && !empresa_asignada.value && !ruta.value) {
    errorMessage.value = "Por favor rellene los campos";
  } else if (!placa.value) {
    errorMessage.value = "Ingrese la Placa";
  } else if (!numero_bus.value) {
    errorMessage.value = "Ingrese el numero del bus";
  } else if (!cantidad_asientos.value) {
    errorMessage.value = "Ingrese la cantidad de asientos";
  } else if (!empresa_asignada.value) {
    errorMessage.value = "Ingrese el nombre de la empresa"
  } else if (!ruta.value) {
    errorMessage.value = "Seleccione una ruta"
  } else {
    errorMessage.value = "";
    validacion.value = true;
  }
}
</script>