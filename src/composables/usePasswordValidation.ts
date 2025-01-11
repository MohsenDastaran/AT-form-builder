import { ref, computed } from "vue";

export function usePasswordValidation() {
  const password = ref("");

  const passwordErrors = computed(() => {
    const errors: string[] = [];

    if (password.value.length < 8) {
      errors.push("رمز عبور باید حداقل ۸ کاراکتر باشد");
    }
    if (!/[A-Z]/.test(password.value)) {
      errors.push("رمز عبور باید حداقل شامل یک حرف بزرگ باشد");
    }
    if (!/[A-Za-z]/.test(password.value)) {
      errors.push("رمز عبور باید حداقل شامل یک حرف باشد");
    }
    if (!/\d/.test(password.value)) {
      errors.push("رمز عبور باید حداقل شامل یک عدد باشد");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password.value)) {
      errors.push("رمز عبور باید حداقل شامل یک نماد باشد");
    }

    return errors;
  });

  return {
    password,
    passwordErrors,
  };
}
