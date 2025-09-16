<script setup lang="ts">
import AdminLayout from "@/layouts/AdminLayout.vue";
import {Button} from "@/components/ui/button";
import {useRouter} from "vue-router";

const router = useRouter();

function onClickNewProduct(){
  router.push("/admin/new-product");
}

function onClickStock(){
  router.push("/admin/stock");
}

</script>

<template>
  <AdminLayout>
    <div class="flex flex-col gap-6 items-center justify-center w-full">
      <Button
          class="flex h-full w-full sm:w-[30%] p-4 items-start justify-start text-lg font-medium border-2  rounded-lg"
          @click="onClickNewProduct"
      >
        Nuevo producto
      </Button>
      <Button
          class="flex h-full w-full sm:w-[30%] p-4 items-start justify-start text-lg font-medium border-2 rounded-lg"
          @click="onClickStock"
      >
        Almacén
      </Button>
    </div>
  </AdminLayout>
</template>
