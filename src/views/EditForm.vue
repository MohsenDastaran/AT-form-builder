<template>
  <CreateForm v-if="!!Object.keys(form).length" :form />
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router";
import CreateForm from "./CreateForm.vue";
import { useFormStore } from "@/store/formStore";
import { ref } from "vue";
const id = useRoute().query.id;
const form = ref({});
useFormStore()
  .getForm(id as string)
  .then((res) => {
    form.value = { id, ...res };
  });
</script>
