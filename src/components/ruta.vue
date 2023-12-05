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

        <q-card-section style="max-height: 50vh" @submit.prevent="validar">
          <q-input  type="number"  v-model="precio"  label="Precio"  style="width: 300px"/>
          <div class="q-pa" style="width: 300px">
            <div class="q-gutter">
              <q-select v-model="horario" :options="options" label="Horario" />
            </div>
          </div>
          <q-input  type="text"  v-model="origen"  label="Origen"  style="width: 300px"/>
          <q-input  type="text"  v-model="destino"  label="Destino"  style="width: 300px"/>

          <div v-if="errorMessage" style="color: red; font-size:medium; font-weight: 600;">{{ errorMessage }}</div>
        </q-card-section>
        <q-separator />

        <q-card-actions align="right">
          <q-btn label="Cerrar" color="orange-10" v-close-popup />
          <q-btn label="Guardar"  color="green"  @click="editarAgregarRuta()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div align="center">
      <h3>Rutas</h3>
      <div class="btn-agregar" style="margin-bottom: 5%; margin-left: -10%;">
        <q-btn color="green" label="Agregar" @click="agregarRuta()" />
      </div>
      <q-table :rows="rows" :columns="columns" row-key="name" style="width:90%">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <label for="" v-if="props.row.estado == 1" style="color: green"  >Activo</label>
            <label for="" v-else style="color: red">Inactivo</label>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn  color="orange-14"  text-color="white"  icon="🖋️"  @click="EditarRuta(props.row._id)"/>
            <q-btn  color="amber"  text-color="white"  icon="❌"  @click="InactivarRuta(props.row._id)"  v-if="props.row.estado == 1"/>
            <q-btn  color="amber"  text-color="white"  icon="✔️"  @click="ActivarRuta(props.row._id)"  v-else/>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>
    
  <script setup>
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { useHorarioStore } from "../stores/horario.js";
import { useRutaStore } from "../stores/ruta.js";
import { useQuasar } from "quasar";

const horarioStore = useHorarioStore();
const rutaStore = useRutaStore();
const $q = useQuasar();

let rutas = ref([]);
let rows = ref([]);
let fixed = ref(false);
let options = ref([]);
let text = ref("");
let precio = ref();
let horario = ref("");
let origen = ref("");
let destino = ref("");
let cambio = ref(0);
let notification = ref(null);

function showNotification(message, type) {
  notification.value = $q.notify({
    message: message,
    type: type,
  });
}

async function obtenerInfo() {
  try {
    await rutaStore.obtenerInfoRutas();
    rutas.value = rutaStore.rutas;
    rows.value = rutaStore.rutas.reverse();
  } catch (error) {
    console.log(error);
  }
}

async function obtenerHorarios() {
  try {
    await horarioStore.getHorario();
    options.value = horarioStore.horarios.map((horario) => ({
      label: `${horario.hora_partida} - ${horario.hora_llegada}`,
      value: String(horario._id),
    }));
  } catch (error) {
    console.log(error);
  }
}


onMounted(async () => {
  obtenerInfo();
});

const columns = [
  { name: "precio", label: "Precio", field: "precio", sortable: true,align:"center" },
  {
    name: "hora_partida",
    label: "Hora Partida",
    field: (row) => row.horario_id.hora_partida,
    align:"center"
  },
  {
    name: "hora_llegada",
    label: "Hora LLegada",
    field: (row) => row.horario_id.hora_llegada,
    align:"center"
  },
  { name: "origen", label: "Origen", field: "origen",align:"center"},
  { name: "destino", label: "Destino", field: "destino",align:"center" },
  { name: "estado", label: "Estado", field: "estado", sortable: true,align:"center" },
  {
    name: "createAT",
    label: "Fecha de Creación",
    field: "createAT",
    sortable: true,
    align:"center",
    format: (val) => format(new Date(val), "yyyy-MM-dd"),
  },
  { name: "opciones", label: "Opciones", sortable: false,align:"center"},
];

function agregarRuta() {
  obtenerHorarios();
  fixed.value = true;
  text.value = "Agregar Ruta";
  cambio.value = 0;
}

async function editarAgregarRuta() {
  validar();
  if (validacion.value) {
    if (cambio.value === 0) {
      try {
        showNotification("Please wait...", "positive");
        await rutaStore.postRuta({
          precio: precio.value,
          horario_id: horario._rawValue.value,
          origen: origen.value,
          destino: destino.value,
        });
        limpiar();
        showNotification("Ruta Agregada", "positive");
        obtenerInfo();
      } catch (error) {
        showNotification(`${error.response.data.error.errors[0].msg}`, "negative");
      }
    } else {
      let id = idRuta.value;
      if (id) {
        try {
          showNotification("Please wait...", "positive");
          await rutaStore.putEditarRuta(id, {
            precio: precio.value,
            horario_id: horario._rawValue.value,
            origen: origen.value,
            destino: destino.value,
          });
          limpiar();
          showNotification("Ruta Actualizada", "positive");
          obtenerInfo();
          fixed.value = false;
        } catch (error) {
          showNotification(`${error.response.data.error.errors[0].msg}`, "negative");
        }
        
      }
    }
    validacion.value = false
  }
}

function limpiar() {
  precio.value = "";
  horario.value = "";
  origen.value = "";
  destino.value = "";
}

let idRuta = ref("");
async function EditarRuta(id) {
  obtenerHorarios();
  cambio.value = 1;
  const rutaSelected = rutas.value.find((ruta) => ruta._id === id);
  if (rutaSelected) {
    idRuta.value = String(rutaSelected._id);
    fixed.value = true;
    text.value = "Editar Ruta";
    precio.value = rutaSelected.precio;
    horario.value = {
      label: `${rutaSelected.horario_id.hora_partida} - ${rutaSelected.horario_id.hora_llegada}`,
      value: String(rutaSelected.horario_id._id),
    };
    origen.value = rutaSelected.origen;
    destino.value = rutaSelected.destino;
  }
}


async function InactivarRuta(id) {
  try {
    await rutaStore.putInactivarRuta(id);
    obtenerInfo();

    $q.notify({
      spinner: false,
      message: "Ruta Inactivada exitosamente.",
      timeout: 2000,
      type: 'negative',
    });
  } catch (error) {
    handleError(error);
  }
}

async function ActivarRuta(id) {
  try {
    await rutaStore.putActivarRuta(id);
    obtenerInfo();

    $q.notify({
      spinner: false,
      message: "Ruta Activada exitosamente.",
      timeout: 2000,
      type: 'positive',
    });
  } catch (error) {
    handleError(error);
  }
}


let validacion = ref(true)

let errorMessage = ref(""); 

async function validar() {

  errorMessage.value = "";

  if (!precio.value && !horario.value && !origen.value && !destino.value) {
    errorMessage.value = "* Por favor rellene los campos";
  } else if (!precio.value) {
    errorMessage.value = "* Ingrese el Precio";
  } else if (!horario.value) {
    errorMessage.value = "* Eliga un Horario";
  } else if (!origen.value) {
    errorMessage.value = "* Digite el Origen";
  }else if(!destino.value){
    errorMessage.value = "* Digite el Destino"
  }

  setTimeout(() => {
    errorMessage.value = '';
  }, 5000);

  validacion.value = errorMessage.value === "";

}


</script>
