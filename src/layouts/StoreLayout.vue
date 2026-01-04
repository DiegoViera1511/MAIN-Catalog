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
  <Navbar/>
  <div class="flex flex-1 pt-20 flex-col overflow-auto">
    <slot/>
    <Footer v-if="props.showFooter"/>
  </div>
</template>