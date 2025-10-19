<script setup lang="ts">
import { Eye } from "lucide-vue-next"
import {ref} from "vue";

const showPassword = ref(false);

const props = defineProps<{
  label: string;
  modelValue: string,
  type?: "text" | "password" | "email",
  placeholder?: string,
}>()

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <label class="block mb-1 text-gray-500">{{props.label}}</label>
  <div class="flex flex-row items-center justify-center bg-white rounded-md px-3">
    <input
        :type="showPassword ? 'text' : type || 'text'"
        :value="modelValue"
        :placeholder="placeholder"
        @input="updateValue"
        class="w-full py-2  rounded-md outline-none"
        required
    />
    <div
        v-show="type === 'password'"
        :class="[
              'text-gray-500 hover:text-black  p-1 hover:bg-gray-300 rounded-md',
              showPassword ? 'bg-gray-300' : ''
          ]"
        @click="showPassword = !showPassword"
    >
      <Eye/>
    </div>
  </div>
</template>