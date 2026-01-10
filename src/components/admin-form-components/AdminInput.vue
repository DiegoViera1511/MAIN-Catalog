<!-- src/components/admin-form-components/AdminInput.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import AdminInputLabel from "@/components/admin-form-components/AdminInputLabel.vue";

interface Props {
  modelValue: string | number | null;
  label?: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  rows?: number; // Para textarea
  multiline?: boolean; // Si es textarea
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  multiline: false,
  rows: 3,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null];
}>();

const inputClass = 'w-full bg-gray-200 dark:text-white dark:bg-neutral-700 rounded px-2 py-1';

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<template>
  <div class="w-full">
    <AdminInputLabel v-if="props.label" :text="props.label"/>

    <textarea
        v-if="multiline"
        v-model="value"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :rows="rows"
        :class="inputClass"
    />

    <input
        v-else
        v-model="value"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :min="min"
        :max="max"
        :step="step"
        :class="inputClass"
    />
  </div>
</template>