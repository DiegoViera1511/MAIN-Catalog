<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import {useRoute} from "vue-router";
import {computed} from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import StoreLayout from "@/layouts/StoreLayout.vue";
import {Routes} from "@/lib/routes.ts";

const route = useRoute();

const adminRoute = computed(() => {
  return route.path.startsWith("/admin");
})

const showFooter = computed(() => {
  return !(route.path === Routes.CONTACT || route.path === Routes.CART);
})

</script>

<template>
  <Toaster
      position="top-right"
      :offset="{
        top: '4rem',
      }"
      :mobile-offset="{
        top: '4rem',
      }"
  />
  <div class="flex flex-col touch-manipulation min-h-screen bg-slate-50 dark:bg-neutral-900">
    <AdminLayout v-if="adminRoute">
      <RouterView/>
    </AdminLayout>
    <StoreLayout :show-footer="showFooter" v-else>
      <RouterView />
    </StoreLayout>
  </div>
</template>
