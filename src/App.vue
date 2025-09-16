<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css' // vue-sonner v2 requires this import
</script>

<template>
  <Toaster />
  <div class="flex flex-col min-h-screen bg-slate-50 dark:bg-neutral-900">
    <router-view></router-view>
  </div>
</template>
