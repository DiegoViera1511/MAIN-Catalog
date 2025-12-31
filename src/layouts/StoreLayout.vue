<script setup lang="ts">
import Navbar from "@/components/Navbar/Navbar.vue";
import Footer from "@/components/Footer.vue";

const props = defineProps({
  showFooter:{
    type: Boolean,
    required: false,
    default: true
  },
})

</script>

<template>
  <div class="flex flex-col h-screen">
    <Navbar/>
    <div class="flex flex-col overflow-auto flex-1">
      <slot/>
      <Footer v-if="props.showFooter"/>
    </div>
  </div>
</template>