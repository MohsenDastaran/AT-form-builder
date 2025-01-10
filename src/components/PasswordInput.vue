<template>
  <div>
    <label
      v-if="label"
      class="block text-sm font-medium mb-1"
      :class="{ 'text-right': rtl }"
      >{{ label }}</label
    >
    <div class="relative">
      <BaseInput
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :type="showPassword ? 'text' : 'password'"
        :placeholder="placeholder"
        :error="modelValue ? error : undefined"
        :rtl="rtl"
        v-bind="$attrs"
      />
      <button
        type="button"
        @click="togglePassword"
        class="absolute left-0 pl-3 flex items-center"
        style="top: 11px"
      >
        <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
        <EyeOffIcon v-else class="h-5 w-5 text-gray-400" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { EyeIcon, EyeOffIcon } from "lucide-vue-next";
import BaseInput from "./BaseInput.vue";

const props = defineProps<{
  modelValue: string;
  label?: string;
  placeholder?: string;
  error?: string;
  rtl?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>
