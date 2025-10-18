<template>
  <div class="form-group">
    <label :for="computedId" class="form-label">
      <span class="label-text">{{ title }}</span>
      <span v-if="required" class="text-danger" aria-hidden="true">*</span>
    </label>

    <Datepicker v-model="internalValue" :format="format" :placeholder="placeholder"
      class="form-control datepicker-input" :id="computedId" :clearable="clearable" :autoApply="autoApply"
      :enable-time-picker="enableTimePicker" :format-locale="viLocale" :min-date="minDate" :max-date="maxDate"
      :disabled="disabled" :readonly="readonly" />

    <span v-if="props.error" class="ms-validation-text text-danger">
      {{ props.error }}
    </span>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
// datepicker default styles (required) - import to avoid unstyled/oversized icons
import '@vuepic/vue-datepicker/dist/main.css';
import { vi } from 'date-fns/locale';
import { parse, format as dfFormat, isValid } from 'date-fns';

const props = defineProps({
  modelValue: { type: [String, Date], default: '' },
  title: { type: String, default: '' },
  required: { type: Boolean, default: false },
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  clearable: { type: Boolean, default: false },
  autoApply: { type: Boolean, default: true },
  enableTimePicker: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  min: { type: [String, Date], default: null },
  max: { type: [String, Date], default: null },
  valueType: { type: String, default: 'string' }, // 'string' | 'date'
  format: { type: String, default: 'dd/MM/yyyy' },
  error: String
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const viLocale = ref(vi);

const hasError = computed(() => !!props.error)
const hintId = computed(() => (props.hint ? `${computedId.value}-hint` : null))
const errorId = computed(() => (hasError.value ? `${computedId.value}-error` : null))
const describedBy = computed(() => {
  const ids = []
  if (!hasError.value && props.hint) ids.push(hintId.value)
  if (hasError.value) ids.push(errorId.value)
  return ids.length ? ids.join(' ') : null
})

// Id generation
const computedId = computed(() => {
  if (props.id) return props.id
  const base = props.name || props.title || 'date'
  return `${base.toString().toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).slice(2, 8)}`
})

const internalValue = ref(null);

function parseToDate(v) {
  if (!v) return null
  if (v instanceof Date) return isValid(v) ? v : null
  const parsed = parse(v, props.format || 'dd/MM/yyyy', new Date())
  return isValid(parsed) ? parsed : null
}

const minDate = computed(() => parseToDate(props.min))
const maxDate = computed(() => parseToDate(props.max))

watch(() => props.modelValue, (newVal) => {
  internalValue.value = parseToDate(newVal)
}, { immediate: true })

watch(internalValue, (newVal) => {
  if (newVal) {
    if (props.valueType === 'date') {
      emit('update:modelValue', newVal)
    } else {
      emit('update:modelValue', dfFormat(newVal, props.format || 'dd/MM/yyyy'))
    }
  } else {
    emit('update:modelValue', '')
  }
})

</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 500;
  margin: 8px 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.label-text {
  display: inline-block;
}

/* Layout is delegated to parent containers (Bootstrap grid). */

.datepicker-input {
  /* remove padding on outer container (library wraps inner elements) */
  padding: 0;
  background-color: transparent;
}

.datepicker-input svg,
.datepicker-input i {
  max-width: 1.25rem;
  max-height: 1.25rem;
}

.datepicker-input:focus {
  outline: none;
  border-color: #4f9cff;
  box-shadow: 0 0 0 3px rgba(79, 156, 255, 0.12);
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

/* Safety overrides for vue-datepicker wrapper to avoid stacked inputs/icons */
/* include multiple possible internal class names used across versions */
.vp__input,
.vp-input,
.vp__input-wrapper,
.vp__input-wrap,
.vue-datepicker__input {
  display: block !important;
  /* let inner wrap/input control layout */
}

/* Move visible padding/border to the internal input element so outer wrapper doesn't add extra space */
.datepicker-input .dp__input_wrap,
.datepicker-input .vp__input-wrap,
.datepicker-input .vp__input-wrapper {
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  padding: 0.45rem 0.6rem !important;
  border: 1px solid #cfcfcf !important;
  border-radius: 4px !important;
  background-color: #fff !important;
  box-sizing: border-box !important;
}

.datepicker-input .dp__input,
.datepicker-input .vp__input input,
.datepicker-input .dp__input input {
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  font-size: 0.95rem !important;
  color: #111 !important;
  background: transparent !important;
  width: 100% !important;
}

.datepicker-input .dp__input_icon,
.datepicker-input .dp__input_icons,
.datepicker-input .vp__input svg {
  width: 1.1rem !important;
  height: 1.1rem !important;
  flex: 0 0 auto !important;
  margin-left: 0.25rem !important;
}
.ms-validation-text {
  margin-top: 0.25rem;
  font-size: 0.875rem;
}
.text-success { color: #28a745; }
.text-danger { color: #dc3545; }
.text-warning { color: #ffc107; }
</style>