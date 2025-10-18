<template>
  <div 
    ref="inputContainer" 
    :class="['ms-input', inputClasses]" 
    class="ms-con-input"
  >
    <label 
      v-if="label && !labelPlaceholder" 
      :for="inputId" 
      class="ms-label" 
      @click="focusInput"
    >
      {{ label }} <span v-if="required" class="text-danger">*</span>
    </label>

    <!-- Input -->
    <div class="ms-input-wrapper">
      <input
        ref="input"
        :id="inputId"
        v-model="model"
        :type="type"
        :placeholder="labelPlaceholder || placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="['ms-input-field']"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
        @keyup.enter="$emit('enter', $event.target.value)"
      />
      <span v-if="icon" :class="['ms-icon', iconPosition]" @click="focusInput">
        <i :class="icon"></i>
      </span>
    </div>

<span v-if="props.error" class="ms-validation-text text-danger">
    {{ props.error }}
  </span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  labelPlaceholder: String,
  placeholder: String,
  type: { type: String, default: 'text', validator: v => ['text', 'password', 'email', 'tel', 'search', 'number'].includes(v) },
  required: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  icon: String,
  iconAfter: Boolean,
  success: Boolean,
  danger: Boolean,
  warning: Boolean,
  successText: String,
  dangerText: String,
  warningText: String,
  inputClass: String,
  error: String
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'enter', 'input'])

const input = ref(null)
const inputContainer = ref(null)

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const inputId = computed(() => props.id || `ms-input-${Math.random().toString(36).slice(2, 8)}`)
const inputClasses = computed(() => ({
  'is-focus': isFocus.value,
  'has-icon': !!props.icon,
  'success': props.success,
  'danger': props.danger,
  'warning': props.warning
}))
const isFocus = ref(false)

const validationText = computed(() => props.successText || props.dangerText || props.warningText || '')
const validationClass = computed(() => ({
  'text-success': props.success,
  'text-danger': props.danger,
  'text-warning': props.warning
}))

const iconPosition = computed(() => props.iconAfter ? 'ms-icon-after' : 'ms-icon-before')

const borderColor = computed(() => isFocus.value ? getColor(props.color) : '#ddd') // ✅ SỬA LẠI

const getColor = (color) => {
  const colors = {
    primary: '#2270dd',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107'
  }
  return colors[color] || '#2270dd'
}

function onFocus(event) {
  isFocus.value = true
  emit('focus', event)
}

function onBlur(event) {  
  isFocus.value = false
  emit('blur', event)     
}

function onInput(event) {
  emit('input', event.target.value)
}

function focusInput() {
  input.value?.focus()
}
</script>

<style scoped>
.ms-input {
  position: relative;
}

.ms-label {
  display: block;
  margin: 8px 0;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.ms-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.ms-input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out;
}

.ms-input-field:focus {
  border-color: v-bind(borderColor); /* ✅ SỬA LẠI */
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(34, 112, 221, 0.25);
}

.ms-input-field:disabled {
  background-color: #f8f9fa;
}

.ms-input-field.normal { padding: 0.5rem 0.75rem; }
.ms-input-field.small { padding: 0.25rem 0.5rem; font-size: 0.875rem; }
.ms-input-field.large { padding: 0.75rem 1rem; font-size: 1.125rem; }

.ms-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.5rem;
  cursor: pointer;
  color: #6c757d;
}

.ms-icon-before { left: 0.5rem; }
.ms-icon-after { right: 0.5rem; }

.ms-input.has-icon .ms-input-field {
  padding-left: 2rem !important; /* Adjust for icon */
}

.ms-input.ms-input-primary.is-focus .ms-input-field { border-color: #2270dd; }
.ms-input.ms-input-success.is-focus .ms-input-field { border-color: #28a745; }
.ms-input.ms-input-danger.is-focus .ms-input-field { border-color: #dc3545; }
.ms-input.ms-input-warning.is-focus .ms-input-field { border-color: #ffc107; }

.ms-validation-text {
  margin-top: 0.25rem;
  font-size: 0.875rem;
}

.text-success { color: #28a745; }
.text-danger { color: #dc3545; }
.text-warning { color: #ffc107; }
</style>