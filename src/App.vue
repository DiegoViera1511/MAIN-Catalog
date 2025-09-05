<script setup lang="ts">
  import Navbar from "./components/Navbar.vue";
  import Footer from "./components/Footer.vue";
</script>

<template>
  <div class="flex flex-col min-h-screen bg-slate-50 dark:bg-neutral-900">
    <Navbar />
    <div class="flex-grow mt-24 mb-28">
      <router-view></router-view>
    </div>
    <Footer />
  </div>
</template>
