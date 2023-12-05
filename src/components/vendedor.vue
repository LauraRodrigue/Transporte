<template>
  <div>
    <q-dialog v-model="fixed">
      <q-card class="modal-content">
        <q-card-section color="orange-12" class="row items-center q-pb-none bg-orange-12">
          <div class="text-h6">{{ text }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />

        <q-card-section style="max-height: 50vh;" @submit.prevent="validar">
          <q-input v-model="cedula" label="Cédula" style="width: 380px" />
          <q-input v-model="nombre" label="Nombre" style="width: 380px" />
          <q-input v-model="cuenta" label="Cuenta" style="width: 380px" />
          <q-input v-model="telefono" label="Telefono" style="width: 380px" />
          <q-input v-model="clave" label="clave" style="width: 380px" />

          <div v-if="errorMessage" style="color: red; font-size:medium; font-weight: 600;">{{ errorMessage }}</div>
        </q-card-section>


        <q-separator />

        <q-card-actions align="center">
          <q-btn color="orange-10" label="CERRAR" v-close-popup />
          <q-btn color="green" label="GUARDAR" @click="agregarEditarVendedor" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div align="center">
      <h3 align="center">Vendedor</h3>
      <div class="btn-agregar" style="margin-bottom: 5%; margin-left: -10%;">
        <q-btn color="green" label="Agregar " @click="agregarVendedor" />
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
            <q-btn color="orange-14" style="margin-right: 5px" @click="EditarVendedor(props.row._id)"><q-icon
                name="🖋️" /></q-btn>
            <q-btn color="amber" @click="InactivarVendedor(props.row._id)" v-if="props.row.estado == 1"><q-icon
                name="❌" /></q-btn>
            <q-btn color="amber" @click="ActivarVendedor(props.row._id)" v-else><q-icon
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
import { useVendedorStore } from "../stores/vendedor.js";
import { useQuasar } from 'quasar'
const VendedorStore = useVendedorStore();

let vendedores = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref("");
let cedula = ref("");
let nombre = ref();
let cuenta = ref("");
let clave = ref();
let telefono = ref("");
let cambio = ref(0);
const $q = useQuasar()
let validacion = ref(true);

async function obtenerInfo() {
  try {
    await VendedorStore.getVendedor();
    vendedores.value = VendedorStore.vendedores;
    rows.value = VendedorStore.vendedores.reverse();
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  obtenerInfo();
});

const columns = [
  { name: "cedula", label: "Cedula", field: "cedula", sortable: true, align: "center" },
  { name: "nombre", label: "Nombre", field: "nombre", sortable: true, align: "center" },
  { name: "cuenta", label: "Cuenta", field: "cuenta", sortable: true, align: "center" },
  { name: "telefono", label: "Telefono", field: "telefono", align: "center" },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: true,
    align: "center",
    format: (val) => (val ? "Activo" : "Inactivo"),
  },
  {
    name: "createAT",
    label: "Fecha de Creación",
    field: "createAT",
    sortable: true,
    align: "center",
    format: (val) => format(new Date(val), "yyyy-MM-dd"),
  },
  {
    name: "opciones",
    label: "Opciones",
    field: (row) => null,
    sortable: false,
    align: "center"
  },
];

function agregarVendedor() {
  fixed.value = true;
  text.value = "Agregar Vendedor";
  cambio.value = 0;
  limpiar();
}

async function agregarEditarVendedor() {
  validar();
  if (validacion.value) {
  try {
      if (cambio.value === 0) {
        await VendedorStore.postVendedor({
          cedula: cedula.value,
          nombre: nombre.value,
          cuenta: cuenta.value,
          clave: clave.value,
          telefono: telefono.value,
        });
      } else {
        let id = idVendedor.value;
        if (id) {
          await VendedorStore.putVendedor(id, {
            cedula: cedula.value,
            nombre: nombre.value,
            cuenta: cuenta.value,
            clave: clave.value,
            telefono: telefono.value,
          });
        }
      }
      limpiar();
      obtenerInfo();
      fixed.value = false;
    } catch (error) {
      $q.notify({ type: 'negative', color: 'negative', message: error.response.data.error.errors[0].msg, timeout: 6000 });
      console.error(error);
    }
  }
}

function limpiar() {
  cedula.value = "";
  nombre.value = "";
  cuenta.value = "";
  clave.value = "";
  telefono.value = "";
}

let idVendedor = ref("");
async function EditarVendedor(id) {
  cambio.value = 1;
  const vendedorSeleccionado = vendedores.value.find((vendedor) => vendedor._id === id);
  if (vendedorSeleccionado) {
    idVendedor.value = String(vendedorSeleccionado._id);
    fixed.value = true;
    text.value = "Editar Vendedor";
    cedula.value = vendedorSeleccionado.cedula;
    nombre.value = vendedorSeleccionado.nombre;
    cuenta.value = vendedorSeleccionado.cuenta;
    telefono.value = vendedorSeleccionado.telefono;
  }
}

async function InactivarVendedor(id) {
  await VendedorStore.putVendedorInactivar(id);
  obtenerInfo();
}

async function ActivarVendedor(id) {
  await VendedorStore.putVendedorActivar(id);
  obtenerInfo();
}

let errorMessage = ref(""); 

async function validar() {

  errorMessage.value = "";

  if (!cedula.value && !nombre.value && !cuenta.value && clave.value && !telefono.value) {
    errorMessage.value = "* Por favor rellene todos los campos";
  } else if (!cedula.value) {
    errorMessage.value = "* Ingrese la cédula";
  } else if (!nombre.value) {
    errorMessage.value = "* Ingrese el nombre";
  }  else if (!cuenta.value) {
    errorMessage.value = "* Ingrese un nombre para su usuario";
  }  else if (!clave.value) {
    errorMessage.value = "* Ingrese una contraseña con números, mayusculas y minusculas";
  } else if (!telefono.value) {
    errorMessage.value = "* Ingrese el teléfono";
  } else if (telefono.value.length !== 10) {
    errorMessage.value = "* El telefono debe tener 10 Digitos";
  } 

  setTimeout(() => {
    errorMessage.value = '';
  }, 5000);


  validacion.value = errorMessage.value === "";

}

</script>
  