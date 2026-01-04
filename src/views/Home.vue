<script setup lang="ts">
import Product from "@/components/Product.vue";
import {ref, onMounted, computed} from "vue";
import {Categories, type ProductType} from "../lib/types.ts";
import { useRouter } from "vue-router";
import {Routes} from "@/lib/routes.ts";
import {getProductsService} from "@/services/product-service.ts";
import {toast} from "vue-sonner";
import {useProductStore} from "@/store/productStore.ts";
import LoadContainer from "@/components/LoadContainer.vue";

const products = ref<ProductType[]>([])
const filteredProducts = computed(() => {
  const category = getCategoryFromRoute(router.currentRoute.value.path)
  if (category) {
    return products.value.filter(p => p.category.includes(category))
  } else {
    return products.value
  }
})
const loading = ref(true)
const router = useRouter()
const productStore = useProductStore()

onMounted( async () => {
  try {
    if (productStore.allProducts.length === 0) {
      products.value = await getProductsService()
      productStore.setProducts(products.value)
    } else {
      products.value = productStore.allProducts
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    toast.error("Error al obtener productos.");
  } finally {
    loading.value = false
  }
})

function getCategoryFromRoute(path: string): string | null {
  if (path.includes(Routes.MEN)) return Categories.MEN;
  if (path.includes(Routes.WOMEN)) return Categories.WOMEN;
  if (path.includes(Routes.ACCESSORIES)) return Categories.ACCESSORIES;
  return null;
}

function goToProduct(productId: number) {
  router.push(Routes.PRODUCT_INFO + productId);
}

</script>

<template>
  <LoadContainer v-if="loading"/>
  <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-2">
    <Product
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        @click="goToProduct(product.id)"
    />
  </div>
</template>
