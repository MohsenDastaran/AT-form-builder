<template>
  <div>
    <label
      v-if="label"
      class="block text-sm font-medium mb-1"
      :class="{ 'text-right': rtl }"
      >{{ label }}</label
    >
    <div class="relative">
      <input
        :type="type"
        :value="modelValue"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        :class="{ 'text-right': rtl, 'mb-4': error }"
        v-bind="$attrs"
      />
      <p
        v-if="error"
        class="mt-1 text-sm text-red-500 absolute"
        style="bottom: -8px"
        :class="{ 'text-right': rtl }"
      >
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  label?: string;
  type?: string;
  error?: string;
  rtl?: boolean;
}>();

defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>
