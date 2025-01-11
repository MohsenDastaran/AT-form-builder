import { defineStore } from "pinia";
import { api } from "@/utils/useApi";

export const useFormStore = defineStore("form", {
  state: () => ({
    forms: [],
  }),

  actions: {
    async getForms() {
      try {
        const response: any = await api.get("forms", {}, true);
        this.forms = response;
        return response.data;
      } catch (err: any) {
        throw err;
      }
    },
    async getForm(id: string) {
      try {
        const response: any = await api.get("form", { form_id: id }, true);

        return response.data;
      } catch (err: any) {
        throw err;
      }
    },
    async submitForm(data: any) {
      try {
        const response: any = await api.post("form", data, true);
        this.forms = response;
        return response;
      } catch (err: any) {
        throw err;
      }
    },
    async editForm(id: string, data: any) {
      try {
        const response: any = await api.put("form", data, true, {
          form_id: id,
        });
        this.forms = response;
        return response;
      } catch (err: any) {
        throw err;
      }
    },
  },
});
