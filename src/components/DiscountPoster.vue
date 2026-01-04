<script setup lang="ts">
import {getDiscountPercentage} from "@/lib/utils.ts";

const props = defineProps<{
  price: number,
  discount_price: number,
  large?: boolean,
  cn?: string,
}>();

</script>

<template>
  <div
      :class="`flex flex-row font-bold bg-gray-200 w-fit rounded-sm p-1 px-2 ${props.cn}`"
  >
    <span>{{getDiscountPercentage(props.price, props.discount_price)}} % OFF </span>
    <span v-if="props.large">| Ahorra ${{(props.price - props.discount_price).toFixed(2)}}</span>
  </div>
</template>

<style scoped>

</style>