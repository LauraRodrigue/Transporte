<template>
    <div class="container-all">
      <div class="q-pa-md example-row-equal-width">
        <div class="row">
          <div class="col">
            <div class="bnt-bc">
              <q-btn color="green" label="Generar Ticket" @click="mostrarModal" />
            </div>
            <div v-if="showmodal" align="center">
              <q-select
                text-color="black"
                v-model="ruta"
                :options="optionsRutas"
                label="Rutas"
                style="width: 320px; margin-bottom:15px;"
              />
              <q-select v-model="bus" :options="optionsBuses" label="Buses" style="width: 320px; margin-bottom:15px;" />
              <q-input v-model="fecha_departida" label="Fecha para Partida" filled type="date" style="width: 320px; margin-bottom:15px;" />
              <q-btn label="Cerrar" color="amber" padding="sm" @click="cerrarModal" />
              <q-btn label="Guardar" color="orange-10" padding="sm" @click="generarTicketInfo()" />

            </div>
            <div v-if="showClienteDiv" class="cliente" align="center">
              <q-btn class="bnt-bc" color="green" label="Buscar Cliente" @click="buscarCliente" />
              <q-input class="label" standout color="green" v-model="cedula" label="Cedula" placeholder="Cedula del cliente" style="width: 300px" />
              <q-input class="label" standout v-model="nombre" label="Nombre" placeholder="Nombre del cliente" style="width: 300px" />
              <q-input class="label" standout v-model="telefono" label="Telefono" placeholder="Telefono del cliente" style="width: 300px" />
              <q-btn class="btn-c" color="orange-10" label="Confirmar" @click="CrearTicket()" />
            </div>
          </div>
          <div class="col-6" align="center" style="margin-top: 60px;">
            <div v-if="asientos.length" class="row">
              <div v-for="i in asientos" :key="i" class="col-3">
                <q-btn
                  padding="md"
                  size="22px"
                  :value="i"
                  @click="no_asiento = i"
                  :style="{
                    backgroundColor: no_asiento === i ? 'orange' : puestos.includes(i) ? 'red' : 'initial',
                    cursor: puestos.includes(i) ? 'not-allowed' : 'pointer',
                  }"
                >
                  💺{{ i }}
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
  
  const $q = useQuasar();
  const busStore = useBusStore();
  const rutaStore = useRutaStore();
  const clienteStore = useClienteStore();
  const ticketStore = useTicketStore();
  const loginStore = useLoginStore();
  
  let ruta = ref("");
  let bus = ref("");
  let fecha_departida = ref("");
  let no_asiento = ref(0);
  let showClienteDiv = ref(false);
  let showmodal = ref(false);
  let cedula = ref("");
  let nombre = ref("");
  let telefono = ref("");
  let buses = ref([]);
  let rutas = ref([]);
  let clientes = ref([]);
  let asientos = ref([]);
  let vendedor = ref([]);
  
  let optionsRutas = ref([]);
  let optionsBuses = ref([]);
  
  // Mostrar Form Rutas Buses y Fecha de partida
  function mostrarModal() {
    obtenerRutas();
    showmodal.value = true;
  }
  
  // Cerrar Modal
  function cerrarModal() {
    showmodal.value = false;
  }
  
  // Obtener Buses, Rutas y clientes
  async function obtenerInfo() {
    await busStore.obtenerInfoBuses();
    buses.value = busStore.buses;
  
    await rutaStore.obtenerInfoRutas();
    rutas.value = rutaStore.rutas;
  
    await clienteStore.getCliente();
    clientes.value = clienteStore.clientes;
  }
  
  // Obtener Opciones de Rutas
  async function obtenerRutas() {
    try {
      await rutaStore.obtenerInfoRutas();
      optionsRutas.value = rutaStore.rutas.map((ruta) => ({
        label: `${ruta.precio} - ${ruta.origen} - ${ruta.destino}`,
        value: String(ruta._id),
      }));
    } catch (error) {
      console.error(error);
    }
  }
  
  // Obtener Opciones de buses
  async function obtenerBuses() {
    try {
      await busStore.obtenerInfoBuses();
      optionsBuses.value = busStore.buses.map((bus) => ({
        label: `${bus.placa} - ${bus.empresa_asignada} - ${bus.numero_bus}`,
        value: String(bus._id),
      }));
    } catch (error) {
      console.error(error);
    }
  }
  
  // Generar listado de Asientos disponibles
  async function generarListaAsientos() {
    await validarAsientos();
    if (validacion.value) {
      const busSeleccionado = buses.value.find((b) => b._id === bus.value);
      if (busSeleccionado) {
        const numeroAsientos = busSeleccionado.cantidad_asientos;
        const listaAsientos = Array.from({ length: numeroAsientos }, (_, index) => index + 1);
        asientos.value = listaAsientos;
      }
    }
  }
  
  let cliente_id = ref("");
  let validacionCliente = ref(null);
  
  // Buscar Clientes
  async function buscarCliente() {
    const clienteEncontrado = clientes.value.find(
      (cliente) => cliente.cedula == cedula.value || cliente.nombre == nombre.value || cliente.telefono == telefono.value
    );
    if (clienteEncontrado) {
      cedula.value = clienteEncontrado.cedula;
      nombre.value = clienteEncontrado.nombre;
      telefono.value = clienteEncontrado.telefono;
      cliente_id.value = clienteEncontrado._id;
      greatMessage.value = "Cliente Encontrado";
      showGreat();
      validacionCliente.value = true;
    } else {
      badMessage.value = "No se encontró ningún cliente";
      showBad();
      validacionCliente.value = false;
    }
  }
  
  // Generar lista Asientos
  async function generarTicketInfo() {
    generarListaAsientos();
  }
  
  // Crear Ticket
  async function CrearTicket() {
    if (validacionCliente.value == true) {
      try {
        showDefault();
        await ticketStore.postTicket({
          vendedor_id: String(vendedor.value._id),
          cliente_id: cliente_id.value,
          ruta_id: ruta.value,
          bus_id: bus.value,
          no_asiento: no_asiento.value,
          fecha_departida: fecha_departida.value,
        });
        cancelShow();
        greatMessage.value = "Ticket Agregado";
        showGreat();
        showmodal.value = false;
        asientos.value = [];
        showClienteDiv.value = false;
      } catch (error) {
        cancelShow();
        badMessage.value = error.response.data.error.errors[0].msg;
        showBad();
      }
        } else {
        cancelShow();
        badMessage.value = "Selecciona un asiento y agrega un cliente";
        showBad();
    }
  }
  
  // Obtener Vendedor
  async function obtenerVendedor() {
    vendedor.value = loginStore.vendedor;
  }
  
  let puestos = ref([]);
  
  // Buscar Asientos Disponibles
  async function validarAsientos() {
    validar();
    if (validacion.value) {
      try {
        const id_ruta = ruta.value;
        const id_bus = bus.value;
        const fecha = fecha_departida.value;
        showDefault();
        await ticketStore.buscarTickets(id_ruta, id_bus, fecha);
        puestos.value = boletoStore.puestos;
        cancelShow();
        greatMessage.value = "Listado Puestos";
        showGreat();
      } catch (error) {
        console.log(error);
        cancelShow();
        badMessage.value = error.response.data.error.errors[0].msg;
        showBad();
      }
    }
  }
  
  watch(ruta, () => {
    obtenerBuses();
  });
  
  watch(no_asiento, () => {
    showClienteDiv.value = true;
  });
  
  onMounted(async () => {
    obtenerInfo();
    obtenerVendedor();
  });
  
  let greatMessage = ref("");
  let badMessage = ref("");
  
  // Notificacion Buena
  const showGreat = () => {
    notification = $q.notify({
      spinner: false,
      message: greatMessage.value,
      timeout: 2000,
      type: "positive",
    });
  };
  
  // Notificacion Mala
  const showBad = () => {
    notification = $q.notify({
      spinner: false,
      message: badMessage.value,
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
    }
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
    }
  }
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
  }
  .btn-c {
    margin-top: 6px;
  }
  .label {
    background-color: rgba(250, 250, 249, 0.226);
    border-radius: 5px;
    border: solid gray 1px;
    margin: 8px;
  }
  </style>