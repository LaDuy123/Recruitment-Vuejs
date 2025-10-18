<template>
  <form class="ms-form" @submit.prevent="onSubmit">
    <slot :form="form" :errors="errors" />
  </form>
</template>

<script setup>
import { watch, reactive } from 'vue'
import { validator } from '@/utils/validatorfn.js'

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },

  validationConfig: { type: Object, default: () => ({}) },

  defaults: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['save', 'update:form'])

const { form: validatorForm, errors, validateForm, reset } = validator()

const form = reactive({ ...props.defaults, ...props.initialData })

watch(
  () => props.initialData,
  (val) => Object.assign(form, props.defaults, val || {}),
  { deep: true, immediate: true }
)

function onSubmit() {
  const valid = validateForm(props.validationConfig)
  if (!valid) return
  emit('save', { ...form })
}

function resetForm() {
  reset()
  Object.assign(form, { ...props.defaults })
}

defineExpose({ form, errors, validateForm, resetForm, onSubmit })
</script>

<style scoped>
.ms-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
