<script setup lang="ts">

const props = defineProps<{
  text: string
}>()
</script>

<template>
  <label class="block mb-1 font-medium dark:text-white">{{ props.text }}</label>
</template>