<script setup lang="ts">
import { Check } from 'lucide-vue-next';
import { Colors, BgColors } from '@/lib/types';
import AdminInputLabel from "@/components/admin-form-components/AdminInputLabel.vue";

interface Props {
  modelValue: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const handleColorSelect = (color: string) => {
  const currentColors = [...props.modelValue];

  if (currentColors.includes(color)) {
    emit('update:modelValue', currentColors.filter((c) => c !== color));
  } else {
    emit('update:modelValue', [...currentColors, color]);
  }
};
</script>

<template>
  <div>
    <AdminInputLabel text="Colores"/>
    <div class="grid grid-cols-5 place-items-center w-full gap-5 p-2 border-2 rounded-xl">
      <div
          v-for="(color, index) in Object.values(Colors)"
          :key="index"
          :class="`flex items-center justify-center w-10 h-10 border-2 rounded-full ${BgColors[color]} cursor-pointer`"
          @click="handleColorSelect(color)"
      >
        <input
            type="checkbox"
            :value="color"
            :checked="modelValue.includes(color)"
            class="sr-only"
        />
        <Check v-if="modelValue.includes(color)" :color="color === 'white' ? 'black' : 'white'" />
      </div>
    </div>
  </div>
</template>