<script setup lang="ts">
import {Button} from "@/components/ui/button";
import type {Component} from "vue";

const props = defineProps<{
  onClick: () => void,
  icon: Component,
  text: string,
}>()

</script>

<template>
  <Button
      class="flex w-full sm:w-[30%] p-8 items-center justify-start text-lg font-medium border-2  rounded-lg"
      @click="props.onClick"
  >
    <component :is="props.icon" />
    {{props.text}}
  </Button>
</template>