<template>
  <div>
    <q-dialog v-model="fixed">
      <q-card class="modal-content">
        <q-card-section class="row items-center q-pb-none" style="color: rgb(113, 113, 113);">
          <div class="text-h6">{{ text }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <q-input v-model="nuevaCedula" label="Cedula" style="width: 300px;" />
          <q-input v-model="nuevoNombre" label="Nombre" style="width: 300px;" />
          <q-input v-model="NuevaExperiencia" label="Experiencia" style="width: 300px;" />
          <q-input v-model="nuevaTelefono" label="Telefono" style="width: 300px;" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn flat label="Guardar " color="primary" @click="guardarConductor()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div>
      <h2>Conductores</h2>
      <div class="btn-agregar">
        <q-btn color="secondary" label="Agregar" @click="agregarConductor()" />
      </div>
      <q-table title="Conductores" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-botones="props">
          <q-td :props="props" class="botones">
            <q-btn color="secondary" text-color="black" label="✏️" @click="EditarConductor(props.row._id)" />
            <q-btn :color="props.row.estado === 1 ? 'orange' : 'amber'" glossy :label="props.row.estado === 1 ? '❌' : '✅'"
              @click="toggleLikeDislike(props.row)" />
          </q-td>
        </template>
      </q-table>
      <div class="volver">
        <q-btn color="amber"><router-link to="/">Volver</router-link></q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';

let apiUrl = 'https://transporte-czaa.onrender.com/api/conductor/conductor';
let conductores = ref([]);
let rows = ref([]);

let fixed = ref(false);
let conductorId = ref(null); // Variable para el ID del bus en edición

async function obtenerInfo() {
  try {
    const responseConductores = await axios.get(apiUrl);
    conductores.value = responseConductores.data.conductor;
    rows.value = responseConductores.data.cliente;
  } catch (error) {
    console.error('Error al obtener la información de los conductores:', error);
  }
}

const columns = [
  { name: 'cedula', label: 'Cédula', field: 'cedula', sortable: true },
  { name: 'nombre', label: 'Nombre', field: 'nombre', sortable: true },
  { name: 'experiencia', label: 'Experiencia', field: 'experiencia', sortable: true },
  { name: 'telefono', label: 'Telefono', field: 'telefono' },
  { name: 'estado', label: 'Estado', field: 'estado', sortable: true, format: (val) => (val ? 'Activo' : 'Inactivo') },
  {
    name: 'createAT', label: 'Fecha de Creación', field: 'createAT', sortable: true,
    format: (val) => format(new Date(val), 'yyyy-MM-dd')
  },
  {
    name: 'botones', label: 'Opciones',
    field: row => null,
    "sortable": false,
  },
];

let text = ref('');
let nuevaCedula = ref('');
let nuevoNombre = ref('');
let nuevaExperiencia = ref('');
let nuevaTelefono = ref('');

function agregarConductor() {
  fixed.value = true;
  text.value = "Agregar Conductor";
  nuevaCedula.value = '';
  nuevoNombre.value = '';
  nuevaExperiencia.value = '';
  nuevaTelefono.value = '';
  conductorId.value = null; // Resetea el ID del bus en edición
}

function EditarConductor(id) {
  const conductorSeleccionado = conductores.value.find((conductor) => conductor._id === id);
  if (conductorSeleccionado) {
    fixed.value = true;
    text.value = "Editar Conductor";
    nuevaCedula.value = cedulaSeleccionado.cedula;
    nuevoNombre.value = nombreSeleccionado.nombre;
    nuevaExperiencia.value = experienciaSeleccionado.experiencia;
    nuevaTelefono.value = telefonoSeleccionado.telefono;
    conductorId.value = conductorSeleccionado._id; // Establece el ID del bus en edición
  }
}

async function guardarConductor() {
  try {
    if (text.value === "Agregar Conductor") {
      // Crear un nuevo bus
      const nuevoConductor = {
        cedula: nuevaCedula.value,
        nombre: nuevoNombre.value,
        experiencia: nuevaExperiencia.value,
        telefono: nuevaTelefono.value,
        estado: 1, // Puedes establecer el estado inicial como activo (1)
      };

      // Realizar la solicitud para crear un nuevo bus en el backend
      const response = await axios.post(apiUrl, nuevoConductor);

      if (response.status === 201) {
        // Si se creó exitosamente, agrega el nuevo bus a la lista local
        clientes.value.push(response.data.conductor);
        fixed.value = false; // Cierra el diálogo
      } else {
        console.error('Error al crear un nuevo conductor en el backend');
      }
    } else if (text.value === "Editar Conductor") {
      // Editar un bus existente
      const conductorSeleccionado = conductor.value.find((conductor) => conductor._id === conductorId.value);

      if (conductorSeleccionado) {
        // Actualiza los campos del bus
        conductorSeleccionado.cedula = nuevaCedula.value;
        conductorSeleccionado.nombre = nuevoNombre.value;
        conductorSeleccionado.experiencia = nuevaExperiencia.value;
        conductorSeleccionado.telefono = nuevaTelefono.value;

        // Realizar la solicitud para actualizar el bus en el backend
        const response = await axios.put(`${apiUrl}/${conductorSeleccionado._id}`, conductorSeleccionado);

        if (response.status === 200) {
          fixed.value = false; // Cierra el diálogo
        } else {
          console.error('Error al actualizar el conductor en el backend');
        }
      }
    }
  } catch (error) {
    console.error('Error al comunicarse con el backend:', error);
  }
}

function toggleLikeDislike(row) {
  if (row.estado === 1) {
    row.estado = 0;
  } else {
    row.estado = 1;
  }
}

onMounted(() => {
  obtenerInfo();
});
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