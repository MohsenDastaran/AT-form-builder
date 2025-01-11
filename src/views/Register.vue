<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">ثبت نام</h2>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <BaseInput
          v-model="email"
          label="ایمیل"
          type="email"
          placeholder="ایمیل خود را وارد کنید"
          :error="emailError"
          rtl
          required
        />

        <div class="space-y-2">
          <PasswordInput
            v-model="password"
            label="رمز عبور"
            placeholder="رمز عبور خود را وارد کنید"
            rtl
            required
          />

          <ul
            v-if="password && passwordErrors.length"
            class="text-sm text-red-500 list-disc list-inside text-right"
          >
            <li v-for="error in passwordErrors" :key="error">{{ error }}</li>
          </ul>
        </div>

        <PasswordInput
          v-model="confirmPassword"
          label="تکرار رمز عبور"
          placeholder="رمز عبور خود را تکرار کنید"
          :error="confirmPasswordError"
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
          :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
        >
          ثبت نام
        </button>
      </form>
      <p class="mt-4 text-center">
        حساب کاربری دارید؟
        <router-link to="/login" class="text-blue-600 hover:underline">
          ورود
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import BaseInput from "../components/BaseInput.vue";
import PasswordInput from "../components/PasswordInput.vue";
import { usePasswordValidation } from "../composables/usePasswordValidation";
import { useEmailValidation } from "../composables/useEmailValidation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/composables/toast";
import { objectMap } from "@/composables/objectMap";

const router = useRouter();
const formError = ref("");
const confirmPassword = ref("");

const { email, emailError } = useEmailValidation();

const { password, passwordErrors } = usePasswordValidation();

const confirmPasswordError = computed(() => {
  if (!confirmPassword.value) return "";
  if (password.value !== confirmPassword.value) {
    return "رمز عبور و تکرار آن مطابقت ندارند";
  }
  return "";
});

const isFormValid = computed(() => {
  return (
    email.value &&
    !emailError.value &&
    password.value &&
    confirmPassword.value &&
    passwordErrors.value.length === 0 &&
    !confirmPasswordError.value
  );
});

const handleRegister = () => {
  if (!isFormValid.value) {
    formError.value = "لطفا تمام فیلدها را به درستی پر کنید";
    return;
  } else {
    useAuthStore()
      .registerUser({
        email: email.value,
        password: password.value,
      })
      .then(() => {
        formError.value = "";
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
