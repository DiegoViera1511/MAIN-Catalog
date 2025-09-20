<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
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
    <Navbar />
    <div class="flex-grow mt-24 mb-28">
      <slot/>
    </div>
    <Footer v-if="props.showFooter" />
</template>