<template>
  <div>
    <q-dialog v-model="fixed">
      <q-card class="modal-content">
        <q-card-section color="orange-12" class="row items-center q-pb-none bg-orange-12" style="color: black;">
          <div class="text-h6">{{ text }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />

        <q-card-section style="max-height: 50vh" @submit.prevent="validar">
          <q-input v-model="hora_partida" label="Hora_partida" style="width: 380px;" />
          <q-input v-model="hora_llegada" label="Hora_llegada" style="width: 380px;" />

          <div v-if="errorMessage" style="color: red; font-size:medium; font-weight: 600;">{{ errorMessage }}</div>

        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn label="Cerrar" color="orange-10" v-close-popup />
          <q-btn label="Guardar" color="green" @click="agregarEditarHorario" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div align="center">
      <h3>Horario</h3>
      <div class="btn-agregar" style="margin-bottom: 5%; margin-left: -10%;">
        <q-btn color="green" label="Agregar" @click="agregarHorario()" />
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
            <q-btn color="orange-14" style="margin-right: 5px;" text-color="white"
              @click="EditarHorario(props.row._id)"><q-icon name="edit" /></q-btn>
            <q-btn color="amber" @click="InactivarHorario(props.row._id)" v-if="props.row.estado == 1"><q-icon
                name="cancel" />
            </q-btn>
            <q-btn color="amber" @click="ActivarHorario(props.row._id)" v-else><q-icon name="check_circle_outline" />
            </q-btn>
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
import { useHorarioStore } from '../stores/horario.js';
import { useQuasar } from 'quasar'
const HorarioStore = useHorarioStore()

let horarios = ref([]);
let rows = ref([]);
let fixed = ref(false)
let text = ref('')
let hora_partida = ref('');
let hora_llegada = ref();
let cambio = ref(0)
const $q = useQuasar()
let validacion = ref(true);


async function obtenerInfo() {
  try {
    await HorarioStore.getHorario();
    horarios.value = HorarioStore.horarios;
    rows.value = HorarioStore.horarios;
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  obtenerInfo()
});

const columns = [
  { name: 'hora_partida', label: 'Hora_partida', field: 'hora_partida', sortable: true, align: "center" },
  { name: 'hora_llegada', label: 'Hora_llegada', field: 'hora_llegada', sortable: true, align: "center" },

  { name: 'estado', label: 'Estado', field: 'estado', sortable: true, align: "center", format: (val) => (val ? 'Activo' : 'Inactivo') },
  {
    name: 'createAT', label: 'Fecha de Creación', field: 'createAT', sortable: true, align: "center",
    format: (val) => format(new Date(val), 'yyyy-MM-dd')
  },
  {
    name: 'opciones', label: 'Opciones',
    field: row => null,
    "sortable": false,
    align: "center"
  },
];

function agregarHorario() {
  fixed.value = true;
  text.value = "Agregar Horario";
  cambio.value = 0
  limpiar();

  errorMessage.value = "";
  validacion.value = true;
}

async function agregarEditarHorario() {
  validar();
  if (validacion.value) {
    try {
      if (cambio.value === 0) {
        await HorarioStore.postHorario({
          hora_partida: hora_partida.value,
          hora_llegada: hora_llegada.value,
        });
        limpiar();
        obtenerInfo();
        fixed.value = false;
      } else {
        let id = idHorario.value;
        if (id) {
          await HorarioStore.putHorario(id, {
            hora_partida: hora_partida.value,
            hora_llegada: hora_llegada.value,
          });
        }
      }
      limpiar();
      obtenerInfo();
      fixed.value = false;
    } catch (error) {
      console.error(error);
      $q.notify({ type: 'negative', color: 'negative', message: error.response.data.error.errors[0].msg, timeout: 6000});
      
    }
  }
}


function limpiar() {
  hora_partida.value = "";
  hora_llegada.value = "";
}

let idHorario = ref('');
async function EditarHorario(id) {
  cambio.value = 1;
  const HorSeleccionado = horarios.value.find((horario) => horario._id === id);
  if (HorSeleccionado) {
    idHorario.value = String(HorSeleccionado._id);
    fixed.value = true;
    text.value = "Editar Horario";
    hora_partida.value = HorSeleccionado.hora_partida;
    hora_llegada.value = HorSeleccionado.hora_llegada;

    errorMessage.value = "";
    validacion.value = true;
  }
}

async function InactivarHorario(id) {
  await HorarioStore.putHorarioInactivar(id);
  obtenerInfo();
}

async function ActivarHorario(id) {
  await HorarioStore.putHorarioActivar(id);
  obtenerInfo();
}

let errorMessage = ref(""); 

async function validar() {
  
  errorMessage.value = "";

  if (!hora_partida.value && !hora_llegada.value) {
    errorMessage.value = "* Por favor rellene los campos";
  } else if (!hora_partida.value) {
    errorMessage.value = "* Ingrese la hora de partida en formato HH:mm:ss";
  } else if (!hora_llegada.value) {
    errorMessage.value = "* Ingrese la hora de llegada en formato HH:mm:ss";
  }

  setTimeout(() => {
    errorMessage.value = '';
  }, 5000);


  validacion.value = errorMessage.value === "";

}
</script>
  