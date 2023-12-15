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
                <q-btn label="Cerrar" color="amber" padding="sm" @click="cerrarModal" />
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
              <q-btn class="btn-c" color="orange-10" label="Confirmar" @click="CrearTicket()" />
              <q-btn class="btn-c" color="green" label="Nueva Venta " @click="nuevaVenta()" />
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

  // Título
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(25);
  doc.setTextColor(255, 0, 0);
  doc.text(`TransporteSA`, 18, 19);

  // Títulos
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(30, 30, 30);
  doc.text(`Información del Cliente:`, 20, 30);

  //Normal
  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(`-Nombre: ${ticket.value.cliente_id.nombre}`, 20, 38);
  doc.text(`-C.C: ${ticket.value.cliente_id.cedula}`, 20, 46);
  doc.text(`-Telefono: ${ticket.value.cliente_id.telefono}`, 20, 54);
  doc.text(`-N° Asiento: ${ticket.value.no_asiento}`, 20, 63);

  // Títulos
  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(`Informacion sobre el Vendedor:`, 22, 81)

  //Normal
  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(`-Nombre: ${ticket.value.vendedor_id.nombre}`, 20, 89);
  doc.text(`-Telefono: ${ticket.value.vendedor_id.telefono}`, 20, 97);

  // Títulos
  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(`Informacion del Conductor:`, 22, 110);

  //Normal
  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(`-Nombre: ${ticket.value.bus_id.conductor_id.nombre}`, 20, 118);
  doc.text(`-Telefono: ${ticket.value.bus_id.conductor_id.telefono}`, 20, 126);

  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(`Informacion del bus:`, 22, 139);

  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(`-Empresa encargada: ${ticket.value.bus_id.empresa_asignada}`, 20, 147);
  doc.text(`-Placa: ${ticket.value.bus_id.placa}`, 20, 155);
  doc.text(`-Nu° de bus: ${ticket.value.bus_id.numero_bus}`, 20, 163);
  doc.text(`-Ruta del bus: ${ticket.value.ruta_id.origen} - ${ticket.value.ruta_id.destino}`, 20, 171);
  doc.text(`-Horario salida: ${ticket.value.ruta_id.horario_id.hora_partida} // Hora de llegada: ${ticket.value.ruta_id.horario_id.hora_llegada}`, 20, 179);
  doc.text(`-Fecha de Partida: ${format(new Date(ticket.value.fecha_departida), "yyyy-MM-dd")}`, 20, 187);



  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 0, 0);
  doc.text(`¡Buen Viaje!`, 20, 203);

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