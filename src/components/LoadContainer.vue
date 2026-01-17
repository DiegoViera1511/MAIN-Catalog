<script setup lang="ts">
import { LoaderCircle } from "lucide-vue-next";
</script>

<template>
  <div class="flex flex-1 justify-center w-full items-center">
    <div class="flex dark:text-white items-center justify-center w-full">
      <LoaderCircle class="animate-spin" :size="50" />
    </div>
  </div>
</template>
