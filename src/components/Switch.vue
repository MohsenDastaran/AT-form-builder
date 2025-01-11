<template>
  <div class="switch-wrapper" :class="{ disabled }">
    <label
      :for="uniqueId"
      class="switch-label"
      :class="[labelClasss, { disabled }]"
    >
      {{ label }}
    </label>
    <div
      class="switch-container"
      :class="{ isChecked, rtl, disabled }"
      @click="toggleSwitch"
    >
      <input
        :id="uniqueId"
        type="checkbox"
        class="switch-input"
        v-model="isChecked"
        :disabled="disabled"
      />
      <span class="switch-slider"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    label: string;
    labelClasss?: string;
    value?: boolean;
    rtl?: boolean;
    disabled?: boolean;
  }>(),
  {
    value: false,
    rtl: true,
    disabled: false,
  }
);

const $emit = defineEmits(["input", "change"]);

const isChecked = ref(props.value);
const uniqueId = ref(`switch-${Math.random().toString(36).substr(2, 9)}`);

watch(
  () => props.value,
  (newValue) => {
    isChecked.value = newValue;
  }
);
watch(
  () => isChecked.value,
  (newValue) => {
    $emit("input", newValue);
  }
);

function toggleSwitch() {
  if (props.disabled) {
    return;
  }
  isChecked.value = !isChecked.value;
  $emit("change", isChecked.value);
}
</script>

<style scoped>
.switch-wrapper {
  display: flex;
  align-items: center;
}

.switch-label {
  margin-right: 10px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
}

.switch-container {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 25px;
  background-color: #ccc;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 0 5px;
  scale: 90%;
}
.switch-wrapper.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.switch-container.disabled {
  cursor: not-allowed;
}

.switch-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: absolute;
  top: 2px;
  background-color: #fff;
  border-radius: 50%;
  transition: transform 0.3s;
}
.switch-slider {
  left: 3px;
  width: 21px;
  height: 21px;
}
.rtl .switch-slider {
  right: 3px;
  width: 21px;
  height: 21px;
}

.switch-input:checked + .switch-slider {
  transform: translateX(24px);
}
.rtl .switch-input:checked + .switch-slider {
  transform: translateX(-24px);
}

.isChecked {
  background-color: #d48267;
}
</style>
