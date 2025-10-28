<script setup lang="ts">
import {Button} from "@/components/ui/button";
import {useRouter} from "vue-router";
import {Shirt,Package,LogOut} from "lucide-vue-next";
import {supabase} from "@/lib/supabase.ts";

const router = useRouter();

function onClickNewProduct() {
  router.push("/admin/new-product");
}

function onClickStock() {
  router.push("/admin/stock");
}

function onClickLogOut() {
  supabase.auth.signOut();
}

</script>

<template>
  <div class="flex flex-col gap-6 items-center justify-start w-full">
    <Button
        class="flex w-full sm:w-[30%] p-8 items-center justify-start text-lg font-medium border-2  rounded-lg"
        @click="onClickNewProduct"
    >
      <Shirt />
      Nuevo producto
    </Button>
    <Button
        class="flex w-full sm:w-[30%] p-8 items-center justify-start text-lg font-medium border-2 rounded-lg"
        @click="onClickStock"
    >
      <Package/>
      Almacén
    </Button>
    <Button
        class="flex w-full sm:w-[30%] p-8 items-center justify-start text-lg font-medium border-2 rounded-lg"
        @click="onClickLogOut"
    >
      <LogOut/>
      Cerrar sesión
    </Button>
  </div>
</template>
