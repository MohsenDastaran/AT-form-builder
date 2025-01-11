import { defineStore } from "pinia";
import { api } from "@/composables/useApi";

interface IntForms {}
export const useFormStore = defineStore("form", {
  state: () => ({
    forms: [],
  }),

  actions: {
    async getForms() {
      try {
        const response: any = await api.get("forms", {}, true);
        this.forms = response;
        return response;
      } catch (err: any) {
        throw err;
      }
    },
    async submitForm(data: any) {
      console.log(data);

      try {
        const response: any = await api.post("form", {}, true);
        this.forms = response;
        return response;
      } catch (err: any) {
        throw err;
      }
    },
  },
});
