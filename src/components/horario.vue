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

              <q-card-section style="max-height: 50vh" class="scroll">
                  <q-input v-model="hora_partida" label="Hora_partida" style="width: 300px;"  />
                  <q-input v-model="hora_llegada" label="Hora_llegada" style="width: 300px;" />
                  <q-input v-model="fecha_partida" label="Fecha_partida" style="width: 300px;" />
                  <q-input v-model="fecha_llegada" label="Fecha_llegada" style="width: 300px;" />
                  
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
                      <q-btn color="orange-14" style="margin-right: 5px;" text-color="white" @click="EditarHorario(props.row._id)"><q-icon name="edit"/></q-btn> 
                      <q-btn color="amber" @click="InactivarHorario(props.row._id)"
                          v-if="props.row.estado == 1" ><q-icon name="cancel"/>
                        </q-btn> 
                      <q-btn color="amber" @click="ActivarHorario(props.row._id)" v-else ><q-icon name="check_circle_outline"/>
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
const   HorarioStore = useHorarioStore()

let horarios = ref([]);
let rows = ref([]);
let fixed = ref(false)
let text = ref('')
let hora_partida = ref('');
let hora_llegada = ref();
let fecha_partida = ref();
let fecha_llegada = ref();
let cambio = ref(0)

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
  { name: 'hora_partida', label: 'Hora_partida', field: 'hora_partida', sortable: true,align:"center" },
  { name: 'hora_llegada', label: 'Hora_llegada', field: 'hora_llegada', sortable: true,align:"center" },
  { name: 'fecha_partida', label: 'Fecha_partida', field: 'fecha_partida', sortable: true,align:"center" },
  { name: 'fecha_llegada', label: 'Fecha_llegada', field: 'fecha_llegada', sortable: true,align:"center" },
  
  { name: 'estado', label: 'Estado', field: 'estado', sortable: true,align:"center", format: (val) => (val ? 'Activo' : 'Inactivo') },
  {
      name: 'createAT', label: 'Fecha de Creación', field: 'createAT', sortable: true,align:"center",
      format: (val) => format(new Date(val), 'yyyy-MM-dd')
  },
  {
      name: 'opciones', label: 'Opciones',
      field: row => null,
      "sortable": false,
      align:"center"
  },
];

function agregarHorario() {
  fixed.value = true;
  text.value = "Agregar Horario";
  cambio.value = 0
  limpiar();
}

async function agregarEditarHorario() {
  if (cambio.value === 0) {
      await HorarioStore.postHorario({
          hora_partida: hora_partida.value,
          hora_llegada: hora_llegada.value,
          fecha_partida: fecha_partida.value,
          fecha_llegada: fecha_llegada.value,
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
              fecha_partida: fecha_partida.value,
              fecha_llegada: fecha_llegada.value,          
          });
          limpiar();
          obtenerInfo();
          fixed.value = false;
      }
  }
}

function limpiar() {
  hora_partida.value = "";
  hora_llegada.value = "";
  fecha_partida.value = "";
  fecha_llegada.value = "";
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
      fecha_partida.value = HorSeleccionado.fecha_partida;
      fecha_llegada.value = HorSeleccionado.fecha_llegada;
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
</script>


<style scoped>
.q-table-container .q-td.opciones {
  text-align: center;
}

.q-btn.opcion-btn {
  margin-right: 5px;
}
</style>
  