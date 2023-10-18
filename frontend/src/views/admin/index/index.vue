<template>
  <v-app id="inspire">
    <v-app-bar density="comfortable">
        <v-spacer></v-spacer>
        <template v-slot:append>
          <v-btn icon="mdi-bell" size="24"></v-btn>
          <v-btn icon="mdi-circle" size="24"></v-btn>
        </template>
      </v-app-bar>
    <!-- Left App Navbar -->
    <MainAppNavVue />
    
    <!-- Components Navigation -->
    <ComponentsNav />
    

    <v-main>
      <Three />
    </v-main>

    <!-- Right Navbar  -->
    <MainToolbarVue />
  </v-app>
</template>

<script setup>
import MainAppNavVue from '../../../components/Admin/MainAppNav.vue';
import MainToolbarVue from '../../../components/Admin/MainToolbar.vue';
import ComponentsNav from '../../../components/Admin/ComponentsNav.vue';
import Three from '../../../components/Canvas/Three.vue';
</script>