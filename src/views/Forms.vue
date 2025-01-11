<template>
  <div class="p-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">فرم ها</h1>
        <router-link
          to="/create-form"
          class="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          + ایجاد فرم
        </router-link>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-5"
      >
        <div
          class="p-6 rounded-lg shadow-sm hover:shadow-md border"
          v-for="form in forms"
        >
          <h3
            class="text-xl font-semibold mb-4 text-center p-10 bg-gray-100 rounded-xl"
          >
            {{ form.form_title }}
          </h3>
          <p class="text-gray-500 text-sm text-right">
            {{ convertToPersianDate(form.created_at) }}
          </p>
          <button
            class="mt-4 p-2 w-full flex justify-center gap-3 border rounded-xl"
          >
            <EyeIcon class="h-5 w-5 text-gray-400" />

            <p>مشاهده فرم</p>
          </button>
        </div>
      </div>
      <div
        v-if="forms.length === 0"
        class="bg-white p-20 flex justify-center items-center gap-3"
      >
        هیچ فرمی تا به حال ساخته نشده است.
        <router-link
          to="/create-form"
          class="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          + ایجاد فرم
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormStore } from "@/store/formStore";
import { Ref, ref } from "vue";
import { EyeIcon } from "lucide-vue-next";

export interface Forms {
  form_id: string;
  form_type: string;
  form_title: string;
  description: string;
  sections: Section[];
  created_at: number;
}

export interface Section {
  title: string;
  type: string;
  required: boolean;
  properties: any[];
}
const convertToPersianDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

const forms: Ref<Forms[]> = ref([]);
useFormStore()
  .getForms()
  .then((res) => {
    forms.value = res.data;
  });
</script>
