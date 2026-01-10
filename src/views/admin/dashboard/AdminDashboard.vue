<script setup lang="ts">
import {useRouter} from "vue-router";
import {Shirt,Package,LogOut} from "lucide-vue-next";
import {supabase} from "@/lib/supabase.ts";
import DashboardButton from "@/views/admin/dashboard/DashboardButton.vue";
import {Routes} from "@/lib/routes.ts";

const router = useRouter();

function onClickNewProduct() {
  router.push(Routes.ADMIN_NEW_PRODUCT);
}

function onClickStock() {
  router.push(Routes.ADMIN_STOCK);
}

function onClickLogOut() {
  supabase.auth.signOut();
}

</script>

<template>
  <div class="flex flex-col gap-6 items-center justify-start w-full">
    <DashboardButton
        :on-click="onClickNewProduct"
        :icon="Shirt"
        text="Nuevo producto"
    />
    <DashboardButton
        :on-click="onClickStock"
        :icon="Package"
        text="Almacén"
    />
    <DashboardButton
        :on-click="onClickLogOut"
        :icon="LogOut"
        text="Cerrar sesión"
    />
  </div>
</template>
