<template>
  <div class="form-group">
    <label :for="computedId" class="form-label">
      <span class="label-text">{{ title }}</span>
      <span v-if="required" class="text-danger" aria-hidden="true">*</span>
    </label>

    <input
      :id="computedId"
      :name="name"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :autofocus="autofocus"
      :autocomplete="autocomplete"
      :aria-invalid="hasError ? 'true' : 'false'"
      :aria-describedby="describedBy"
      class="form-control"
      @input="onInput"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />

    <p v-if="hint && !hasError" :id="hintId" class="form-hint">{{ hint }}</p>
    <p v-if="hasError" :id="errorId" class="form-error" role="alert">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  title: { type: String, default: '' },
  required: { type: Boolean, default: false },
  type: { type: String, default: 'text' },
  // layout handled by parent (Bootstrap grid). Remove col prop.
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  maxlength: { type: [String, Number], default: null },
  autofocus: { type: Boolean, default: false },
  autocomplete: { type: String, default: 'off' }
})

const emit = defineEmits(['update:modelValue', 'input', 'blur', 'focus'])

// Generate an id if not provided so label works correctly
const computedId = computed(() => {
  if (props.id) return props.id
  // create id from name or title
  const base = props.name || props.title || 'textinput'
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

// layout is controlled by parent (use Bootstrap grid classes like `col-md-6`)

function onInput(e) {
  const v = e.target.value
  emit('update:modelValue', v)
  emit('input', v)
}
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
}
.form-label {
  font-weight: 600;
  margin: 8px 0;
  color: #222;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.form-label { font-size: 14px; }
.label-text { display: inline-block; }
.form-control {
  padding: 0.5rem 0.75rem;
  border: 1px solid #cfcfcf;
  border-radius: 4px;
  font-size: 0.95rem;
  line-height: 1.25;
  transition: border-color 0.12s ease-in-out, box-shadow 0.12s ease-in-out;
  background-color: #fff;
  color: #111;
  width: 100%;
  box-sizing: border-box;
}
.form-control:focus {
  outline: none;
  border-color: #4f9cff;
  box-shadow: 0 0 0 3px rgba(79,156,255,0.12);
}
.form-control[disabled], .form-control[readonly] {
  background-color: #f7f7f7;
  color: #8a8a8a;
  cursor: not-allowed;
}
.form-hint {
  margin-top: 0.375rem;
  font-size: 0.85rem;
  color: #6b6b6b;
}
.form-error {
  margin-top: 0.375rem;
  font-size: 0.85rem;
  color: #c53030; /* red */
}

/* Layout is delegated to parent containers (Bootstrap grid). */
</style>