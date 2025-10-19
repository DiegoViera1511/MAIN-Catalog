<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css' // vue-sonner v2 requires this import
import {useRoute} from "vue-router";
import {computed} from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";

const route = useRoute();

const adminRoute = computed(() => {
  return route.path.startsWith("/admin");
})

</script>

<template>
  <Toaster />
  <div class="flex flex-col touch-manipulation min-h-screen bg-slate-50 dark:bg-neutral-900">
    <AdminLayout v-if="adminRoute">
      <RouterView/>
    </AdminLayout>
    <RouterView v-else/>
  </div>
</template>
