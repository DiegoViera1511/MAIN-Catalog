<script setup lang="ts">
import ProductsContainer from "./ProductsContainer.vue";
import Product from "./Product.vue";
import { ref ,onMounted} from "vue";
import type {ProductType} from "../types.ts";
const products = ref<ProductType[]>([])
const loading = ref(true)
const error = ref("")

onMounted(async () => {
  try {
    const response = await fetch('../../products.json')
    console.log(response)
    products.value = await response.json()
  } catch (err) {
    error.value = "error"
  } finally {
    loading.value = false
  }
})

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
    />
  </ProductsContainer>
</template>
