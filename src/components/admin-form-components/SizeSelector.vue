<!-- src/components/admin-form-components/SizeSelector.vue -->
<script setup lang="ts">
import { availableSizes } from '@/lib/types';
import AdminInputLabel from "@/components/admin-form-components/AdminInputLabel.vue";

interface Props {
  modelValue: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;
  const isChecked = target.checked;

  let newValue = [...props.modelValue];

  if (isChecked) {
    newValue.push(value);
  } else {
    newValue = newValue.filter((v) => v !== value);
  }

  emit('update:modelValue', newValue);
};
</script>

<template>
  <div>
    <AdminInputLabel text="Tallas disponibles" />
    <div class="flex gap-3 dark:text-white">
      <label
          v-for="size in availableSizes"
          :key="size"
          class="flex items-center gap-1"
      >
        <input
            type="checkbox"
            :value="size"
            :checked="modelValue.includes(size)"
            @change="handleChange"
            class="w-6 h-6 accent-black"
        />
        {{ size }}
      </label>
    </div>
  </div>
</template>