<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {ProductType} from "@/lib/types.ts";
import AlertDialogDeleteProduct from "@/components/AlertDialogDeleteProduct.vue";
import {SquarePen} from "lucide-vue-next";
import {Button} from "@/components/ui/button";
import router from "@/router";
import {getProductsService} from "@/services/product-service.ts";
import {Routes} from "@/lib/routes.ts";
import LoadContainer from "@/components/LoadContainer.vue";

const products = ref<ProductType[]>([])
const loading = ref<boolean>(true)

onMounted(async () => {
  try {
    products.value = await getProductsService()
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
})

const onDeleted = (id: number) => {
  products.value = products.value.filter(p => p.id !== id);
}

const onEdit = (id: number) => {
  router.push(Routes.ADMIN_EDIT_PRODUCT + id)
}

</script>

<template>
  <LoadContainer v-if="loading"/>
  <div v-else class="flex flex-col gap-6 items-center justify-center w-full">
    <div
        class="flex flex-col items-center border-b-2 pb-3 border-b-gray-200 dark:text-white dark:border-b-gray-700 gap-4 w-full justify-between"
        v-for="(product,index) in products"
        :key="index"
    >
      <div class="flex flex-row w-full justify-start gap-4 items-center">
        <img :src="product.url" alt="product image" class="w-[150px] h-[150px] bg-gray-200 object-cover rounded-md"/>
        <div class="flex flex-col items-start justify-center font-medium text-lg w-[150px] h-[150px]">
          <span>{{ product.title }}</span>
        </div>
      </div>
      <div class="flex flex-row w-full gap-2 items-center justify-around">
        <Button
            class="w-20 bg-white border-2 text-cyan-500"
            @click="() => onEdit(product.id)"
        >
          <SquarePen />
        </Button>
        <AlertDialogDeleteProduct :product="product" @deleted="() => onDeleted(product.id)"/>
      </div>
    </div>
  </div>
</template>