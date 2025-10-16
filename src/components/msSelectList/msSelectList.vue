<template>
  <div class="form-group">
    <label :for="computedId" class="form-label">
      <span class="label-text">{{ title }}</span>
      <span v-if="required" class="text-danger" aria-hidden="true">*</span>
    </label>

    <select
      :id="computedId"
      :name="name"
      :value="modelValue"
      :multiple="multiple"
      :size="size"
      :disabled="disabled"
      :aria-invalid="hasError ? 'true' : 'false'"
      :aria-describedby="describedBy"
      :class="['form-select', { 'has-value': hasValue }]"
      @change="onChange"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    >
      <option v-if="placeholder && !multiple" value="" disabled class="placeholder">{{ placeholder }}</option>
      <option v-for="option in list" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <p v-if="hint && !hasError" :id="hintId" class="form-hint">{{ hint }}</p>
    <p v-if="hasError" :id="errorId" class="form-error" role="alert">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number, Array], default: '' },
  title: { type: String, default: '' },
  required: { type: Boolean, default: false },
  list: { type: Array, default: () => [] },
  // layout handled by parent (Bootstrap grid). Remove col prop.
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  multiple: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  size: { type: [String, Number], default: null }
})

const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus'])

const computedId = computed(() => {
  if (props.id) return props.id
  const base = props.name || props.title || 'select'
  return `${base.toString().toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).slice(2,8)}`
})

const hasError = computed(() => !!props.error)
const hintId = computed(() => (props.hint ? `${computedId.value}-hint` : null))
const errorId = computed(() => (hasError.value ? `${computedId.value}-error` : null))
const describedBy = computed(() => {
  const ids = []
  if (!hasError.value && props.hint) ids.push(hintId.value)
  if (hasError.value) ids.push(errorId.value)
  return ids.length ? ids.join(' ') : null
})

const hasValue = computed(() => {
  if (props.multiple) return Array.isArray(props.modelValue) && props.modelValue.length > 0
  return props.modelValue !== '' && props.modelValue != null
})


// layout is controlled by parent (use Bootstrap grid classes like `col-md-6`)

function onChange(e) {
  let value = null
  if (props.multiple) {
    // collect selected options
    value = Array.from(e.target.selectedOptions).map(o => o.value)
  } else {
    value = e.target.value
  }
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 500;
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.form-label { font-size: 14px; }
.label-text { display: inline-block; }

/* Layout is delegated to parent containers (Bootstrap grid). */

.form-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #cfcfcf;
  border-radius: 4px;
  background-color: #fff;
  font-size: 0.95rem;
  transition: border-color 0.12s ease-in-out, box-shadow 0.12s ease-in-out;
}
.form-select:focus {
  outline: none;
  border-color: #4f9cff;
  box-shadow: 0 0 0 3px rgba(79,156,255,0.12);
}
.form-select[disabled] {
  background-color: #f7f7f7;
  color: #8a8a8a;
}
.form-select .placeholder {
  color: #9aa0a6; /* lighter tone for placeholder */
}

/* If the select has no value, show the visible text in lighter color (some browsers show option differently) */
.form-select:not(.has-value) {
  color: #6b6b6b;
}
.form-hint {
  margin-top: 0.375rem;
  font-size: 0.85rem;
  color: #6b6b6b;
}
.form-error {
  margin-top: 0.375rem;
  font-size: 0.85rem;
  color: #c53030;
}

</style>