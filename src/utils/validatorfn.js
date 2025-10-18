import { ref } from 'vue'

export function validator() {
  const rules = {
    required: (value, label) => {
      const isValid = !!value?.toString().trim()
      return isValid ? true : `${label} là bắt buộc`
    },
    email: (value) => {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      return isValid ? true : 'Email không hợp lệ'
    },
    phone: (value) => {
      const isValid = /^0[3|5|7|8|9][0-9]{8}$/.test(value)
      return isValid ? true : 'Số điện thoại không hợp lệ'
    }
  }

  const form = ref({})
  const errors = ref({})
  const isValid = ref(true)

  const validateField = (fieldName, value, config) => {
    const { rules: fieldRules, label } = config
    errors.value[fieldName] = null

    for (const rule of fieldRules) {
      let result
      if (rule === 'required') {
        result = rules.required(value, label)
      } else if (rule === 'email') {
        result = rules.email(value)
      } else if (rule === 'phone') {
        result = rules.phone(value)
      }
      
      // ✅ FIX: RESULT = TRUE/FALSE + MESSAGE
      if (result !== true) {
        errors.value[fieldName] = typeof result === 'string' ? result : 'Lỗi không xác định'
        return false
      }
    }
    return true
  }

  const validateForm = (fieldsConfig) => {
    isValid.value = true
    errors.value = {}

    for (const [fieldName, config] of Object.entries(fieldsConfig)) {
      const value = form.value[fieldName]
      const valid = validateField(fieldName, value, config)
      if (!valid) isValid.value = false
    }

    return isValid.value
  }

  const reset = () => {
    errors.value = {}
    isValid.value = true
  }

  return {
    form,
    errors,
    isValid,
    validateForm,
    reset
  }
}