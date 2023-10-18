<template>
    
    <div class="column absolute-center">

    <q-card class="my-card bg-orange-2 text-black"  style="height: 410px; width: 350px;">
      <q-card-section class="column flex-center">
        <q-avatar size="100px" font-size="52px" color="orange-10" text-color="white" icon="face" />
      </q-card-section>
      <q-card-section>
       <q-form @submit="onSubmit" @reset="onReset">
          <q-input
            filled
            v-model="name"
            label="Usuario"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <q-input
            filled
            type="number"
            v-model="age"
            label="Contraseña"
            lazy-rules
            :rules="[
              (val) => (val > 0 && val < 100) || 'Please type a real age',
            ]"
          />

          <q-toggle v-model="accept" label="I accept the license and terms" />

          <div class="text-center">
            <router-link to="/menu"><q-btn  label="Ingresar" type="submit" color="orange-10" /></router-link>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
    </div>

</template>
<script setup></script>


