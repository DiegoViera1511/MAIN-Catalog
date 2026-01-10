<script setup lang="ts">
const props = defineProps<{
  text: string,
  onClick: () => void,
}>()
</script>

<template>
  <span
      class="hover:text-blue-800 font-medium cursor-pointer"
      @click="props.onClick"
  >
    {{props.text}}
  </span>
</template>

<style scoped>

</style>