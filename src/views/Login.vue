<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6">خوش آمدید</h2>
      <h4 class="mb-6 text-gray-400">برای ورود رمزو ایمیل خود را وارد کنید</h4>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <BaseInput
          v-model="email"
          label="ایمیل"
          type="email"
          placeholder="ایمیل خود را وارد کنید"
          :error="emailError"
          rtl
          required
        />

        <PasswordInput
          v-model="password"
          label="رمز عبور"
          placeholder="رمز عبور خود را وارد کنید"
          :error="passwordErrors.length ? passwordErrors[0] : ''"
          rtl
          required
        />

        <div v-if="formError" class="text-red-500 text-sm text-right">
          {{ formError }}
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          :disabled="!isFormValid"
        >
          ورود
        </button>
      </form>
      <p class="mt-4 text-center">
        حساب کاربری ندارید؟
        <router-link to="/register" class="text-blue-600 hover:underline">
          ثبت نام
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import BaseInput from "../components/BaseInput.vue";
import PasswordInput from "../components/PasswordInput.vue";
import { usePasswordValidation } from "../composables/usePasswordValidation";
import { useEmailValidation } from "../composables/useEmailValidation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/utils/toast";
import { objectMap } from "@/utils/objectMap";

const router = useRouter();
const formError = ref("");

const { email, emailError } = useEmailValidation();

const { password, passwordErrors } = usePasswordValidation();

const isFormValid = computed(() => {
  return (
    email.value &&
    password.value &&
    !emailError.value &&
    passwordErrors.value.length === 0
  );
});

const handleLogin = () => {
  if (!isFormValid.value) {
    formError.value = "لطفا تمام فیلدها را به درستی پر کنید";
    return;
  } else {
    useAuthStore()
      .loginUser({
        email: email.value,
        password: password.value,
      })
      .then(() => {
        router.push("/");
        toast.success("ثبت نام با موفقیت انجام شد");
      })
      .catch((err) => {
        objectMap(err.data.error, (value: string, key: string) => {
          toast.error(`${key} Error: ${value}`);
        });
      });
  }
};
</script>
