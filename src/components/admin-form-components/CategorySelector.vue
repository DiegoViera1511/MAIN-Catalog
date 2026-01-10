<script setup lang="ts">
import {Categories} from "@/lib/types.ts";
import {SpanishCategories} from "@/lib/types.ts";
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
    <AdminInputLabel text="Categoría"/>
    <div class="flex gap-4 dark:text-white">
      <label
          v-for="category in Categories"
          :key="category"
          class="flex items-center gap-1"
      >
        <input
            type="checkbox"
            :value="category"
            :checked="modelValue.includes(category)"
            @change="handleChange"
            class="w-6 h-6 accent-black"
        />
        {{ SpanishCategories[category] }}
      </label>
    </div>
  </div>
</template>