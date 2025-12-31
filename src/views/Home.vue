<script setup lang="ts">
import Product from "@/components/Product.vue";
import {ref, onMounted, computed} from "vue";
import type {ProductType} from "../lib/types.ts";
import { useProductStore } from '../store/productStore'
import { useRouter } from "vue-router";
import {supabase} from "@/lib/supabase.ts";
import {LoaderCircle} from "lucide-vue-next";

const products = ref<ProductType[]>([])
const productStore = useProductStore()
const loading = ref(true)
const error = ref("")
const router = useRouter()

function getCategoryFromRoute(path: string): string | null {
  if (path.includes('/men')) return 'MEN';
  if (path.includes('/women')) return 'WOMEN';
  if (path.includes('/accessories')) return 'ACCESSORIES';
  return null;
}

const filteredProducts = computed(() => {
  const category = getCategoryFromRoute(router.currentRoute.value.path)
  if (category) {
    return products.value.filter(p => p.category.includes(category))
  } else {
    return products.value
  }
})

onMounted( async () => {
  try {
    if (productStore.allProducts.length === 0) {
      let { data, error } = await supabase
          .from('product')
          .select('*')
          .order('created_at',{ascending: false})
      if (error) {
        console.log(error)
      }
      products.value = data as ProductType[]
      productStore.setProducts(products.value)
    } else {
      products.value = productStore.allProducts
    }
  } catch (err) {
    error.value = "error"
  } finally {
    loading.value = false
  }
})


function goToProduct(productId: number) {
  router.push("/product/" + productId);
}

</script>

<template>
  <div v-if="loading" class="flex justify-center w-full items-center h-full">
    <div class="flex dark:text-white items-center justify-center  w-full">
      <LoaderCircle class="animate-spin" :size="50" />
    </div>
  </div>
  <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-2">
    <Product
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        @click="goToProduct(product.id)"
    />
  </div>
</template>
