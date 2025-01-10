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

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 class="text-xl font-semibold mb-4 text-right">نام فرم</h3>
          <p class="text-gray-500 text-sm text-right">۱۲ بهمن ۱۴۰۲</p>
          <button
            class="mt-4 text-blue-600 hover:text-blue-800 text-right w-full"
          >
            مشاهده فرم
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormStore } from "@/store/formStore";

useFormStore().getForms();
</script>
