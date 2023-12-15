<template>
  <div class="container-all">
    <div class="q-pa-md example-row-equal-width">
      <div class="row">
        <div class="col">
          <div class="bnt-bc">
            <q-btn color="green" label="Generar Ticket" @click="mostrarModal" />
          </div>
          <!-- Modal -->
          <div class="container-cuestionario" align="center">
            <div v-if="rutaBusFecha" class="container-rutaBusFecha">
              <div class="rutaBusFecha">
                <q-select text-color="black" v-model="ruta" :options="optionsRutas" label="Rutas"
                  style="width: 320px; margin-bottom:15px;" />
                <q-select v-model="bus" :options="optionsBuses" label="Buses" style="width: 320px; margin-bottom:15px;" />
                <q-input v-model="fecha_departida" label="Fecha para Partida" filled type="date"
                  style="width: 320px; margin-bottom:15px;" :options="opcionesFecha"/>
                <!-- <q-input filled v-model="fecha_departida" mask="date" :rules="['date']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="fecha_departida" :options="opcionesFecha">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input> -->
              </div>
              <div class="options">
                <q-btn label="Cerrar" color="amber" padding="sm" style="margin-right: 6px;" @click="cerrarModal" />
                <q-btn label="Guardar" color="orange-10" padding="sm" @click="generarTicketInfo()" />
              </div>
            </div>
          </div>
          <div class="busCliente">
            <div v-if="showClienteDiv" class="cliente" align="center">
              <h4 v-if="no_asiento" class="asientoNumero"
                style="padding: 0;margin: 8px; margin-top: 30px; font-family: 'Kanit', sans-serif;">
                Asiento N°{{ no_asiento }}</h4>
              <q-btn class="bnt-bc" color="amber" label="Agregar Cliente" @click="agregarCliente" />
              <q-btn class="bnt-bc" color="orange-10" label="Buscar Cliente" @click="buscarCliente()" />
              <q-input lass="label" standout v-model="cedula" label="Cedula del Cliente" style="width: 300px" />
              <q-input lass="label" standout v-model="nombre" label="Nombre" style="width: 300px" />
              <q-input lass="label" standout v-model="telefono" label="Telefono" style="width: 300px" />
              <q-btn class="btn-c" color="green" label="Confirmar" @click="CrearTicket()" />
            </div>
          </div>
        </div>
        <div class="col-6" align="center" style="margin-top: 60px;">
          <div class="row" v-if="asientos.length">
            <div class="row" v-for="i in asientos" :key="i">
              <q-btn padding="md" size="23px" class="btn" :value="i.numero" @click="!i.ocupado && (no_asiento = i.numero)"
                :style="{
                  backgroundColor: no_asiento === i.numero ? 'orange' : i.ocupado ? 'orange' : 'initial',
                  cursor: i.ocupado ? 'not-allowed' : 'pointer',
                }"> 💺{{ i.numero }}
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useBusStore } from "../stores/buses.js";
import { useRutaStore } from "../stores/ruta.js";
import { useClienteStore } from "../stores/clientes.js";
import { useTicketStore } from "../stores/boleto.js";
import { useLoginStore } from "../stores/login.js";
import { useQuasar } from "quasar";
import { jsPDF } from "jspdf";
import { format } from "date-fns";

function opcionesFecha(fecha) {
  console.log(fecha);
  const fechaA = fechaActual()
  return fecha >= fechaA
}

function fechaActual() {
  const fecha = new Date
  const formatoFecha = `${fecha.getFullYear()}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getDate().toString().padStart(2, '0')}`

  return formatoFecha
}

const $q = useQuasar();
const busStore = useBusStore();
const rutaStore = useRutaStore();
const clienteStore = useClienteStore();
const ticketStore = useTicketStore();
const loginStore = useLoginStore();

let fixed = ref(false);

let ruta = ref("");
let bus = ref("");
let fecha_departida = ref("");
let no_asiento = ref(0);
let showClienteDiv = ref(false);
let rutaBusFecha = ref(false);
let cedula = ref();
let nombre = ref("");
let telefono = ref();
let buses = ref([]);
let rutas = ref([]);
let clientes = ref([]);
let asientos = ref([]);
let vendedor = ref([]);

let optionsRutas = ref([]);
let optionsBuses = ref([]);

// Mostrar Form Rutas Buses y Fecha de partidad
function mostrarModal() {
  obtenerRutas();
  fixed.value = true;
  rutaBusFecha.value = true;
};

// Cerrar Modal
function cerrarModal() {
  fixed.value = false;
  rutaBusFecha.value = false;
};

// Obtener Buses, Rutas y clientes 
async function obtenerInfo() {
  await busStore.obtenerInfoBuses();
  buses.value = busStore.buses;

  await rutaStore.obtenerInfoRutas();
  rutas.value = rutaStore.rutas;

  await clienteStore.obtenerInfoClientes();
  clientes.value = clienteStore.clientes;
};

// Obtener Opciones de Rutas 
async function obtenerRutas() {
  try {
    await rutaStore.obtenerInfoRutas();
    const rutasActivas = rutaStore.rutas.filter((ruta) => ruta.estado === true);

    optionsRutas.value = rutasActivas.map((ruta) => {
      const precioNumber = parseFloat(ruta.precio);

      const precioFormateado = !isNaN(precioNumber)
        ? precioNumber.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
        })
        : ruta.precio;

      return {
        label: `${precioFormateado} - ${ruta.origen} - ${ruta.destino}`,
        value: String(ruta._id),
      };
    });
  } catch (error) {
    console.log(error);
  };
};

// Obtener Opciones de buses
async function obtenerBuses() {
  try {
    await busStore.obtenerInfoBuses();
    const busesActivos = busStore.buses.filter(bus => bus.estado === true);
    optionsBuses.value = busesActivos.map((bus) => ({
      label: `${bus.placa} - ${bus.empresa_asignada} - ${bus.numero_bus}`,
      value: String(bus._id),
    }));
  } catch (error) {
    console.log(error);
  };
};

// Generar listado de Asientos disponibles
async function generarListaAsientos() {
  await validarAsientos();
  if (validacion.value) {
    const busSeleccionado = buses.value.find((b) => b._id === bus._rawValue.value);
    if (busSeleccionado) {
      const numeroAsientos = busSeleccionado.cantidad_asientos;
      const listaAsientos = [];
      for (let i = 1; i <= numeroAsientos; i++) {
        const isOcupado = puestos.value.includes(i);
        listaAsientos.push({ numero: i, ocupado: isOcupado });
      }
      asientos.value = listaAsientos;
    }
  }
}

let cliente_id = ref("");
let validacionCliente = ref(null)

// Buscar Clientes 
async function buscarCliente() {
  const clienteEncontrado = clientes.value.find((cliente) => cliente.cedula == cedula.value);

  if (clienteEncontrado) {
    if (clienteEncontrado.estado === true) {
      cedula.value = clienteEncontrado.cedula;
      nombre.value = clienteEncontrado.nombre;
      telefono.value = clienteEncontrado.telefono;
      cliente_id.value = clienteEncontrado._id;
      greatMessage.value = "Cliente Encontrado";
      showGreat();
      validacionCliente.value = true;
    } else {
      badMessage.value = "Cliente Inactivado";
      showBad();
    }
  } else {
    badMessage.value = "No se encontro ningun cliente";
    showBad();
    validacionCliente.value = false;
  }
}

// Generar lista Asientos 
async function generarTicketInfo() {
  fixed.value = false;
  generarListaAsientos();
};
const ticketRes = ref({})
// Crear Ticket
async function CrearTicket() {
  if (validacionCliente.value == true) {
    try {
      console.log(ruta);
      showDefault();
      const r = await ticketStore.postTicket({
        vendedor_id: localStorage.getItem('vendedor_id'),
        cliente_id: cliente_id.value,
        ruta_id: ruta._rawValue.value,
        bus_id: bus._rawValue.value,
        no_asiento: no_asiento.value,
        fecha_departida: fecha_departida.value,
      });
      console.log(r);
      ticketRes.value = r.ticket
      cancelShow();
      greatMessage.value = "Ticket Agregado";
      generarTicket();
      showGreat();
      generarListaAsientos()
      limpiarDatos(); 
    } catch (error) {
      console.log(error);
      cancelShow();
      badMessage.value = error.response.data.error.errors[0].msg;
      showBad();
    };
  } else {
    cancelShow();
    badMessage.value = "Agrega un Cliente"
    showBad();
  };
};

//Nueva Venta
function nuevaVenta() {
  fixed.value = false;
  ruta.value = "";
  bus.value = "";
  fecha_departida.value = "";
  rutaBusFecha.value = false;
  asientos.value = [];
  showClienteDiv = false;
  cedula.value = "";
  nombre.value = "";
  telefono.value = "";
}

// Obtener Vendedor
async function obtenerVendedor() {
  vendedor.value = loginStore.vendedor;
};

// Agregar Cliente
async function agregarCliente() {
  try {
    showDefault();
    const response = await clienteStore.postCliente({
      cedula: cedula.value,
      nombre: nombre.value,
      telefono: telefono.value,
    });

    cancelShow();
    // limpiar();
    greatMessage.value = "Cliente Agregado";

    showGreat();
    await obtenerInfo();
    buscarCliente();
  } catch (error) {
    console.log(error);
    cancelShow();
    badMessage.value = error.response.data.error.errors[0].msg;
    showBad();
  };
};


let puestos = ref([]);
// Buscar Asientos Disponibles
async function validarAsientos() {
  validar();
  if (validacion.value == true) {
    try {
      const id_ruta = ruta._rawValue.value;
      const id_bus = bus._rawValue.value;
      const fecha = fecha_departida.value;
      showDefault();
      await ticketStore.buscarTickets(id_ruta, id_bus, fecha);
      puestos.value = ticketStore.puestos;
      cancelShow();
      greatMessage.value = "Listado Puestos";
      showGreat();
    } catch (error) {
      console.log(error);
      cancelShow();
      badMessage.value = error.response.data.error.errors[0].msg;
      showBad();
    };
  };
};

let ticket = ref([]);

function generarTicket() {


  ticket.value = ticketRes.value
  const doc = new jsPDF();

  const precioNumber = parseFloat(ticket.value.ruta_id.precio);

  const precioFormateado = !isNaN(precioNumber)
    ? precioNumber.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
      })
    : ticket.value.ruta_id.precio;

  doc.line(20, 13, 190, 13);
  doc.line(20, 14, 190, 14);
  doc.text(`Información del Ticket`, 80, 25);
  doc.line(20, 33, 190, 33);
  doc.line(20, 34, 190, 34);
  doc.text(`N° Asiento: ${ticket.value.no_asiento}`, 150, 40);
  doc.text(`Ruta: ${ticket.value.ruta_id.origen} - ${ticket.value.ruta_id.destino}`, 25, 40);
  doc.text(`Hora de partida: ${format(new Date(ticket.value.fechahora_venta),'HH:mm:ss')}`, 25, 50);
  doc.text(`Fecha de Partida: ${format(new Date(ticket.value.fecha_departida), "yyyy-MM-dd")}`, 25, 60);
  doc.line(20, 63, 190, 63);
  doc.line(20, 64, 190, 64);
  doc.text(`Empresa: ${ticket.value.bus_id.empresa_asignada}`, 25, 70);
  doc.text(`Placa-Bus: ${ticket.value.bus_id.placa}`, 25, 80);
  doc.text(`N°-Bus: ${ticket.value.bus_id.numero_bus}`, 25, 90);
  doc.line(20, 93, 190, 93);
  doc.line(20, 94, 190, 94);
  doc.text(`Cliente: ${ticket.value.cliente_id.nombre}`, 25, 100);
  doc.text(`Documento: ${ticket.value.cliente_id.cedula}`, 25, 110);
  doc.text(`Telefono: ${ticket.value.cliente_id.telefono}`,25, 120);
  doc.line(20, 123, 190, 123);
  doc.line(20, 124, 190, 124);
  doc.text(`Vendedor: ${ticket.value.vendedor_id.nombre}`, 25, 130);
  doc.text(`Telefono: ${ticket.value.vendedor_id.telefono}`, 25, 140);
  doc.line(20, 143, 190, 143);
  doc.line(20, 144, 190, 144);
  doc.text(`Valor Total: $ ${precioFormateado}`, 135, 150);
  doc.line(20, 153, 190, 153);
  doc.line(20, 154, 190, 154);


  doc.save(`ticket_${ticket.value._id}.pdf`);

}

watch(ruta, () => {
  obtenerBuses();
});

watch(no_asiento, () => {
  showClienteDiv = true;
});
onMounted(async () => {
  obtenerInfo();
  obtenerVendedor();
});

let greatMessage = ref("");
let badMessage = ref("");

const showGreat = () => {
  notification = $q.notify({
    spinner: false,
    message: greatMessage,
    timeout: 2000,
    type: "positive",
  });
};

const showBad = () => {
  notification = $q.notify({
    spinner: false,
    message: badMessage,
    timeout: 2000,
    type: "negative",
  });
};

// Notificacion de Carga
const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: "Please wait...",
    timeout: 0,
  });
};

// Cancelar Notificacion
const cancelShow = () => {
  if (notification) {
    notification();
  };
};

let notification = ref(null);

let validacion = ref(false);

async function validar() {
  if (!ruta.value && !bus.value && !fecha_departida.value) {
    badMessage.value = "Por favor rellene los campos";
    showBad();
  } else if (!ruta.value) {
    badMessage.value = "Seleccione la ruta";
    showBad();
  } else if (!bus.value) {
    badMessage.value = "Seleccione el bus";
    showBad();
  } else if (!fecha_departida.value) {
    badMessage.value = "Seleccione la fecha de partida";
    showBad();
  } else {
    validacion.value = true;
  };
};

function limpiarDatos() {
  // Limpiar datos del cliente
  cedula.value = "";
  nombre.value = "";
  telefono.value = "";
  cliente_id.value = "";

  // Limpiar número de asiento
  no_asiento.value = 0;
}
//Limite de fecha
function getFechaActual() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

</script>

<style scoped>
.container-all {
  margin: 0;
  padding: 0;
  width: 100%;
}

.cliente input {
  margin-top: 8px;
}

.bnt-bc {
  margin-top: 35px;
  margin-bottom: 15px;
  margin-right: 6px;
}

.btn-c {
  margin-top: 6px;
  margin-right: 6px;
}

.btn {
  width: 90px;
  height: 80px;
  padding: 2px;
}

.label {
  background-color: rgb(141, 141, 141);
  border-radius: 5px;
  border: solid gray 1px;
  margin: 8px;
}</style>

