<template>
  <div class="q-pa-md">
    <q-table title="DATOS BUS" :rows="rows" :columns="columns" row-key="cedula">
      <template v-slot:body-cell-status="props">
        <q-td key="estado" :props="props">
          <span class="color1" v-if="props.row.estado == 1">Activo</span>
          <span class="color2" v-else>Inactivo</span>
        </q-td>
      </template>
      <template v-slot:body-cell-acciones="props">
        <q-td key="acciones" :props="props">
          <q-btn class="btnEditar" icon="edit" color="amber" @click="editarBus(props.row)"></q-btn>
          <q-btn class="btnActivar" v-if="props.row.estado == 1" @click="desactivar(props.row._id)">❌</q-btn>
          <q-btn class="btnActivar" v-else @click="activar(props.row._id)">✅</q-btn>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="modal">
      <q-card>
        <q-card-section>
          <div class="text-h6">DATOS DE BUSES</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="infoDatos">
            <div class="ilDatos">
              <label class="labelDatos" for="placa">Placa:</label>
              <input class="inputDatos" type="text" id="placa" v-model="nuevaPlaca" />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="modelo">Modelo:</label>
              <input class="inputDatos" type="text" id="modelo" v-model="nuevoNumeroBus" />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="soat"> Soat:</label>
              <input class="inputDatos" type="text" id="soat" v-model="nuevaCantidadAsientos" />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="n_asiento">Numero asientos:</label>
              <input class="inputDatos" type="number" id="n_asiento" v-model="nuevaEmpresaAsignada" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" @click="limpiar" v-close-popup />
          <q-btn flat label="Aceptar" color="primary" @click="agregarEditarBus" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-btn label="Agregar" color="primary" @click="modal = true" />

  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useBusStore } from '../stores/buses.js';
import { format } from 'date-fns';

const busStore = useBusStore();


const rows = ref([]);
const modal = ref(false);
const nuevaPlaca = ref('');
const nuevoNumeroBus = ref('');
const nuevaCantidadAsientos = ref('');
const nuevaEmpresaAsignada = ref('');

const columns = [
  { name: 'placa', label: 'Placa', field: 'placa', sortable: true },
  { name: 'numero_bus', label: 'Número de Bus', field: 'numero_bus', sortable: true },
  { name: 'cantidad_asientos', label: 'Cantidad de Asientos', field: 'cantidad_asientos' },
  { name: 'empresa_asignada', label: 'Empresa Asignada', field: 'empresa_asignada' },
  {
    name: 'estado', label: 'Estado', field: 'estado', sortable: true,
    format: (val) => (val ? 'Activo' : 'Inactivo')
  },
  {
    name: 'createAT', label: 'Fecha de Creación', field: 'createAT', sortable: true,
    format: (val) => format(new Date(val), 'yyyy-MM-dd')
  },
  {
    name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones",
  }
];

async function obtenerBus() {
  try {
    const buses = await busStore.obtener();
    console.log('Buses obtenidos:', buses);
    rows.value = busStore.datosData.buses;
  } catch (error) {
    console.error('Error al obtener los buses:', error);
  }
}

/* function agregarBus() {
  fixed.value = true;
  text.value = "Agregar Bus";
  nuevaPlaca.value = '';
  nuevoNumeroBus.value = '';
  nuevaCantidadAsientos.value = '';
  nuevaEmpresaAsignada.value = '';
  busId.value = null; // Resetea el ID del bus en edición
}

function EditarBus(id) {
  const busSeleccionado = buses.value.find((bus) => bus._id === id);
  if (busSeleccionado) {
    fixed.value = true;
    text.value = "Editar Bus";
    nuevaPlaca.value = busSeleccionado.placa;
    nuevoNumeroBus.value = busSeleccionado.numero_bus;
    nuevaCantidadAsientos.value = busSeleccionado.cantidad_asientos;
    nuevaEmpresaAsignada.value = busSeleccionado.empresa_asignada;
    busId.value = busSeleccionado._id; // Establece el ID del bus en edición
  }
}

async function guardarBus() {
  try {
    if (text.value === "Agregar Bus") {
      // Crear un nuevo bus
      const nuevoBus = {
        placa: nuevaPlaca.value,
        numero_bus: nuevoNumeroBus.value,
        cantidad_asientos: nuevaCantidadAsientos.value,
        empresa_asignada: nuevaEmpresaAsignada.value,
        estado: 1, // Puedes establecer el estado inicial como activo (1)
      };

      // Realizar la solicitud para crear un nuevo bus en el backend
      const response = await axios.post(apiUrl, nuevoBus);

      if (response.status === 201) {
        // Si se creó exitosamente, agrega el nuevo bus a la lista local
        buses.value.push(response.data.bus);
        fixed.value = false; // Cierra el diálogo
      } else {
        console.error('Error al crear un nuevo bus en el backend');
      }
    } else if (text.value === "Editar Bus") {
      // Editar un bus existente
      const busSeleccionado = buses.value.find((bus) => bus._id === busId.value);

      if (busSeleccionado) {
        // Actualiza los campos del bus
        busSeleccionado.placa = nuevaPlaca.value;
        busSeleccionado.numero_bus = nuevoNumeroBus.value;
        busSeleccionado.cantidad_asientos = nuevaCantidadAsientos.value;
        busSeleccionado.empresa_asignada = nuevaEmpresaAsignada.value;

        // Realizar la solicitud para actualizar el bus en el backend
        const response = await axios.put(`${apiUrl}/${busSeleccionado._id}`, busSeleccionado);

        if (response.status === 200) {
          fixed.value = false; // Cierra el diálogo
        } else {
          console.error('Error al actualizar el bus en el backend');
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
} */

onMounted(() => {
  obtenerBus();
});
</script>


  
<style scoped>
.color1 {
  color: rgb(136, 226, 0);
}

.color2 {
  color: red;
}

.infoDatos {
  display: flex;
  margin: 0 auto;
  flex-direction: column;
}

.ilDatos {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;

}

.labelDatos {
  display: flex;
  align-items: center;
  width: 60px;

}

.inputDatos {
  width: 200px;
  padding: 5px;
}

.btnEditar {
  margin: 5px;
}


label {
  margin-right: 20px;
}
</style>