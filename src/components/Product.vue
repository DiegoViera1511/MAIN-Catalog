<script setup lang="ts">
import ProductImage from "@/components/ProductImage.vue";
import type { ProductType } from "@/lib/types.ts";

const props = defineProps<{
  product: ProductType;
}>();
</script>

<template>
  <div
    class="flex flex-col w-full hover:shadow-sm items-center justify-center gap-2 py-3 rounded-md"
  >
    <ProductImage
      :imageSrc="props.product.url"
      :colors="props.product.colors"
      :price="props.product.price"
      :discount_price="props.product.discount_price"
    />
    <div class="flex flex-col w-full justify-start items-start dark:text-white">
      <div class="flex flex-row items-center w-full justify-between">
        <p>{{ props.product.title }}</p>
        <div
          v-show="!props.product.available"
          class="flex items-center justify-center border-2 border-red-800 rounded-full px-3 text-red-800 font-medium"
        >
          Agotado
        </div>
      </div>
      <div>
        <span v-if="props.product.discount_price" class="text-md font-bold">
          ${{ props.product.discount_price }}
        </span>
        <span
          class="text-md font-bold"
          :class="
            props.product.discount_price ? 'line-through text-red-700 ml-2' : ''
          "
        >
          ${{ props.product.price }}
        </span>
      </div>
    </div>
  </div>
</template>
