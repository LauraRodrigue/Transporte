<template>
    <div class="container-all">
        <div class="q-pa-md example-row-equal-width">
            <div class="row">
                <div class="col">
                    <div class="bnt-bc">
                        <q-btn color="green" label="Generar Ticket" @click="mostrarModal"/>
                    </div>
                    <div v-if="showmodal" align="center">
                        <q-select text-color="black" v-model="ruta" :options="optionsRutas" label="Rutas" style="width: 320px; margin-bottom:15px;" />
                        <q-select v-model="bus" :options="optionsBuses" label="Buses" style="width: 320px; margin-bottom:15px;"/>
                        <q-input v-model="fecha_departida" label="Fecha para Partida" filled type="date" style="width: 320px; margin-bottom:15px;" />
                        <q-btn label="Cerrar" color="amber" padding="sm" @click="cerrarModal" />
                        <q-btn label="Guardar" color="orange-10" padding="sm" @click="generarTicketInfo()" />
                       </div>
                    <div v-if="showClienteDiv" class="cliente" align="center">
                        <q-btn  class="bnt-bc" color="green" label="Buscar Cliente" @click="buscarCliente()" />
                        <q-input class="label" standout color="green"  v-model="cedula" label="Cedula" placeholder="Cedula del cliente" style="width: 300px" />
                        <q-input class="label" standout v-model="nombre" label="Nombre" placeholder="Nombre del cliente" style="width: 300px" />
                        <q-input class="label" standout v-model="telefono" label="Telefono" placeholder="Telefono del cliente"  style="width: 300px"/>
                        <q-btn  class="btn-c" color="orange-10" label="Confirmar" @click="CrearTicket()" />
                    </div>
                </div>
                <div class="col-6" align="center" style="margin-top: 60px;">
                    <div v-if="asientos.length" class="row">
                        <div v-for="i in asientos" :key="i" class="col-3" >
                            <q-btn push padding="md" size="22px" :value="i" @click="no_asiento = i" :style="{ backgroundColor: no_asiento === i ? 'orange' : 'initial' }" >💺{{ i }}</q-btn>
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

const busStore = useBusStore();
const rutaStore = useRutaStore();
const clienteStrore = useClienteStore();
const ticketStore = useTicketStore();
const loginStore = useLoginStore();


let fixed = ref(false);
let text = ref("");
let ruta = ref("");
let bus = ref("");
let fecha_departida = ref("");
let no_asiento = ref(0);
let showClienteDiv = ref(false);
let showmodal = ref(false);
let cedula = ref('');
let nombre = ref('');
let telefono = ref('');
let buses = ref([]);
let rutas = ref([]);
let clientes = ref([]);
let asientos = ref([]);
let vendedor = ref([]);

let optionsRutas = ref([]);
let optionsBuses = ref([]);

function mostrarModal() {
    // Configurar la información necesaria antes de mostrar el modal
    obtenerRutas();
    fixed.value = true;
    text.value = "Generar Ticket";
    showmodal.value = true;
}

function cerrarModal() {
    // Opcional: Restablecer los valores o realizar otras acciones al cerrar el modal
    fixed.value = false;
    showmodal.value = false;
}

async function obtenerInfo() {
    await busStore.obtenerInfoBuses();
    buses.value = busStore.buses;

    await rutaStore.obtenerInfoRutas();
    rutas.value = rutaStore.rutas;

    await clienteStrore.obtenerInfoClientes()
    clientes.value = clienteStrore.clientes
}

async function obtenerRutas() {
    try {
        await rutaStore.obtenerInfoRutas();
        optionsRutas.value = rutaStore.rutas.map((ruta) => ({
            label: `${ruta.precio} - ${ruta.origen} - ${ruta.destino}`,
            value: String(ruta._id),
        }));
    } catch (error) {
        console.log(error);
    }
}

async function obtenerBuses() {
    const busesFiltrados = buses.value.filter((bus) => bus.ruta_id._id === ruta._rawValue.value);
    optionsBuses.value = busesFiltrados.map((bus) => ({
        label: `${bus.placa} - ${bus.empresa_asignada} - ${bus.numero_bus}`,
        value: String(bus._id),
    }));
}

function generarListaAsientos() {
    const busSeleccionado = buses.value.find((b) => b._id === bus._rawValue.value);
    if (busSeleccionado) {
        const numeroAsientos = busSeleccionado.cantidad_asientos;
        const listaAsientos = [];
        for (let i = 1; i <= numeroAsientos; i++) {
            listaAsientos.push(Number(i));
        }
        asientos.value = listaAsientos;
    }
}

let cliente_id = ref("")
async function buscarCliente() {
    const clienteEncontrado = clientes.value.find(cliente => cliente.cedula === cedula.value || cliente.nombre === nombre.value || cliente.telefono === telefono.value);
    if (clienteEncontrado) {
        cedula.value = clienteEncontrado.cedula;
        nombre.value = clienteEncontrado.nombre;
        telefono.value = clienteEncontrado.telefono;
        cliente_id.value = clienteEncontrado._id
    }
}

async function generarTicket() {
    await obtenerRutas();
    fixed.value = true;
    text.value = "Generar Ticket";
    showmodal.value = true; // Asegúrate de que showmodal se establezca en true aquí
}

async function generarTicketInfo() {
    fixed.value = false;
    generarListaAsientos();
}

async function CrearTicket() {
    // const token = loginStore.token;
    // console.log(token);

    await ticketStore.postTicket({
        vendedor_id: String(vendedor.value._id),
        cliente_id: cliente_id.value,
        bus_id: bus._rawValue.value,
        no_asiento: no_asiento.value,
        fecha_departida: fecha_departida.value
    });
}

async function obtenerVendedor() {
    vendedor.value = loginStore.vendedor;
}

let tickets = ref([])


async function validarAsientos() {
    await ticketStore.getTickets();
    tickets.value = ticketStore.ticket

    const date = new Date(ticketStore.ticket.fecha_departida);
    const formattedDate = date.toISOString().split('T')[0];

    fecha_departida.value = formattedDate;
    const ticketFechaPartida = tickets.value.map((ticket) => ticket.fecha_departida = fecha_departida.value)

    if (ticketVendedorId) {

    }
}

watch(ruta, () => {
    obtenerBuses();
});

watch(no_asiento, () => {
    showClienteDiv = true;
});

onMounted(async () => {
    obtenerInfo();
    obtenerVendedor()
});
</script>
  
<style scoped>
.container-all{
    margin: 0;
    padding: 0;
    width: 100%;
}
  .cliente input{
    margin-top: 8px;
  }
  .bnt-bc{
    margin-top: 35px;
    margin-bottom: 15px;
  }
  .btn-c{
    margin-top: 6px;
  }
  .label{
    background-color: rgba(250, 250, 249, 0.226);
    border-radius: 5px;
    border: solid gray 1px; 
    margin: 8px;
  }


</style>