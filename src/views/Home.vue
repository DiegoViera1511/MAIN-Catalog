<script setup lang="ts">

import ProductsList from "../components/ProductsList.vue";
import {onMounted, ref} from "vue";

const isMobile = ref(false);

onMounted(() => {
  isMobile.value = window.matchMedia('(max-width: 768px)').matches;
});
</script>

<template>
  <ProductsList/>
</template>