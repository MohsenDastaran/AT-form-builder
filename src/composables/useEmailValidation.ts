import { ref, computed } from 'vue'

export function useEmailValidation() {
  const email = ref('')
  
  const emailError = computed(() => {
    if (!email.value) return ''
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      return 'لطفا یک ایمیل معتبر وارد کنید'
    }
    
    return ''
  })

  return {
    email,
    emailError,
  }
}