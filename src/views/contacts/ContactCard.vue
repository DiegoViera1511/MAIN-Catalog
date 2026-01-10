<script setup lang="ts">

import {Link} from "lucide-vue-next";
import type {Component} from "vue";

const props = defineProps<{
  href: string;
  socialNetworkIcon: Component;
  text: string;
  identifier: string;
  textIconColor?: string;
}>();

</script>

<template>
  <a
      :href="props.href"
      target="_blank"
      rel="noopener noreferrer"
  >
    <div
        class="flex flex-row gap-4 shadow items-center justify-between text-lg bg-gray-100 dark:bg-neutral-800 p-4 rounded-lg hover:shadow-md w-full"
    >
      <div class="flex flex-row gap-4 items-center justify-start">
        <component :class="textIconColor" :is="props.socialNetworkIcon" />
        <div class="flex flex-col">
          <p class="font-medium text-xl">{{props.text}}</p>
          <p class="font-medium text-sm text-gray-500">{{props.identifier}}</p>
        </div>
      </div>
      <div class="flex items-center justify-end">
        <Link/>
      </div>
    </div>
  </a>
</template>