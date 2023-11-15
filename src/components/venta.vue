<template>
    <div class="container-all">
      <!-- Modal -->
        <q-dialog v-model="fixed">
            <q-card class="modal-content">
                <q-card-section color="orange-12" class="row items-center q-pb-none bg-orange-12" >
                    <div class="text-h6">{{ text }}</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
            <q-separator />
            <q-card-section style="max-height: 50vh" class="scroll">
                <div class="q-pa" style="width: 350px;">
                    <div class="q-gutter">
                        <q-select v-model="ruta" :options="optionsRutas" label="Rutas" />
                    </div>
                </div>
                <div class="q-pa" style="width: 350px;">
                    <div class="q-gutter">
                        <q-select v-model="bus" :options="optionsBuses" label="Buses" />
                    </div>
                </div>
                <q-input v-model="fecha_departida" filled type="date" hint="Fecha para Partida" style="width: 350px" />
                
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
                <q-btn label="Cerrar" color="orange-10" v-close-popup />
                <q-btn label="Guardar" color="green" @click="generarTicketInfo()" />
            </q-card-actions>
            </q-card>
        </q-dialog>
      
        <div class="container">
            <div class="btn-generar">
                <q-btn color="green" label="Generar Ticket" @click="generarTicket()" />
            </div>
            <div class="container-info">
                <div v-if="asientos.length" class="container-bus">
                    <div v-for="i in asientos" :key="i" class="container-asientos">
                        <button type="button" :value="i" @click="no_asiento = i" :style="{ backgroundColor: no_asiento === i ? 'red' : 'initial' }">{{ i }} 💺</button>
                    </div>
                </div>
                <div v-if="showClienteDiv" class="cliente">
                    <q-btn  class="bnt-bc" color="primary" label="Buscar Cliente" @click="buscarCliente()" />
                    <q-input class="label" standout v-model="cedula" label="Cedula" placeholder="Cedula del cliente" style="width: 300px" />
                    <q-input class="label" standout v-model="nombre" label="Nombre" placeholder="Nombre del cliente" style="width: 300px" />
                    <q-input class="label" standout v-model="telefono" label="Telefono" placeholder="Telefono del cliente"  style="width: 300px"/>
                    <q-btn  class="btn-c" color="primary" label="Generar Ticket" @click="CrearTicket()" />
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
let cedula =  ref('');
let nombre =  ref('');
let telefono =  ref('');
let buses = ref([]);
let rutas = ref([]);
let clientes = ref([]);
let asientos = ref([]);
let vendedor = ref([]);

let optionsRutas = ref([]);
let optionsBuses = ref([]);

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

async function obtenerVendedor(){
    vendedor.value = loginStore.vendedor;
}

let tickets = ref([])


async function validarAsientos(){
    await ticketStore.getTickets();
    tickets.value = ticketStore.ticket

    const date = new Date(ticketStore.ticket.fecha_departida);
    const formattedDate = date.toISOString().split('T')[0]; 

    fecha_departida.value = formattedDate;
    const ticketFechaPartida = tickets.value.map((ticket)=> ticket.fecha_departida = fecha_departida.value)

    if (ticketVendedorId){
        
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

.container{
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}
.btn-generar{
    width: 100%;
    margin-top: 70px;
    display: flex;
    justify-content: center;
    margin-right: 10px;
}
.container-info{
    display: flex;
    width: 100%;
    flex-direction: column;
}
.container-bus {
    height: 250px;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    margin-top: 70px;
  }
  
  .container-asientos {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    
  }
  
  .container-asientos button {
    width: 70px;
    height: 70px;
    margin: 5px;
    font-size: 6mm;
    border-radius: 5px;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    border: solid rgb(0, 67, 252)
  }
  .cliente{
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    margin-top: 80px;
  }
  .cliente input{
    margin: 4px;
  }
  .bnt-bc{
    margin-bottom: 2px;
  }
  .btn-c{
    margin-top: 2px;
  }
  .label{
    background-color: rgba(100, 100, 100, 0.329);
    border-radius: 5px;
    border: solid gray 1px; 
    margin: 1px;
  }
</style>