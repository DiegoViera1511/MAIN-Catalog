<script setup lang="ts">
import ProductsContainer from "./ProductsContainer.vue";
import Product from "./Product.vue";
import {ref, onMounted} from "vue";
import type {ProductType} from "../types.ts";
import { useProductStore } from '../store/productStore'
import { useRouter } from "vue-router";
import {supabase} from "@/lib/supabase.ts";
import {LoaderCircle} from "lucide-vue-next";

const products = ref<ProductType[]>([])
const productStore = useProductStore()
const loading = ref(true)
const error = ref("")
const router = useRouter()

onMounted( async () => {
  try {
    let { data, error } = await supabase
        .from('product')
        .select('*')
    if (error) {
      console.log(error)
    }
    products.value = data as ProductType[]
    productStore.setProducts(products.value)
  } catch (err) {
    error.value = "error"
  } finally {
    loading.value = false
  }
})

function goToProduct(productId: number) {
  router.push({ name: "ProductInfo", params: { id: productId } });
}

</script>

<template>
  <div v-if="loading" class="flex justify-center w-full items-center h-52">
    <div class="flex dark:text-white items-center justify-center  w-full">
      <LoaderCircle class="animate-spin" :size="50" />
    </div>
  </div>
  <ProductsContainer>
    <Product
        v-for="(product, index) in products"
        :key="index"  
        :title="product.title"
        :description="product.description"
        :price="product.price"
        :imageSrc="product.url"
        :category="product.category"
        @click="goToProduct(product.id)"
    />
  </ProductsContainer>
</template>
