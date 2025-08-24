<script setup lang="ts">
import ProductsContainer from "./ProductsContainer.vue";
import Product from "./Product.vue";
import {ref, onMounted} from "vue";
import type {ProductType} from "../types.ts";
import { useProductStore } from '../store/productStore'
import { useRouter } from "vue-router";

const productStore = useProductStore()
const products = ref<ProductType[]>([])
const loading = ref(true)
const error = ref("")
const router = useRouter()

onMounted(async () => {
  try {
    const response = await fetch('../../products.json')
    console.log(response)
    products.value = await response.json() as ProductType[]
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
