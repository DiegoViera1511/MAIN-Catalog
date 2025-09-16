<script setup lang="ts">
import AdminNavbar from "@/components/AdminNavbar.vue";
</script>

<template>
  <AdminNavbar/>
  <div class="flex-grow mt-24 mb-28 p-5">
    <slot/>
  </div>
</template>