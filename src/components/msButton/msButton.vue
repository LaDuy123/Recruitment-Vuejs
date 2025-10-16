<template>
  <button
    :class="['ui-btn', `ui-btn--${variant}`, sizeClass]"
    :disabled="disabled"
    @click="$emit('click', $event)"
    type="button"
  >
    <i v-if="icon" :class="icon" aria-hidden="true" style="margin-right:0.5rem"></i>
    <span class="btn-content"><slot /></span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: { type: String, default: 'md' }, // sm | md | lg
  icon: { type: String, default: '' }, // e.g. 'fas fa-plus'
  variant: { type: String, default: 'primary' }, // primary | secondary | ghost
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'ui-btn--sm'
    case 'lg': return 'ui-btn--lg'
    default: return 'ui-btn--md'
  }
})
</script>

<style scoped>
.ui-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
.ui-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.ui-btn--md { padding: 8px 12px; font-size: 14px; }
.ui-btn--sm { padding: 6px 10px; font-size: 13px; }
.ui-btn--lg { padding: 12px 18px; font-size: 16px; }

.ui-btn--primary { background: #2270dd; color: #fff; }
.ui-btn--secondary { background: #f5f6f8; color: #222; border: 1px solid #e0e0e0; }
.ui-btn--ghost { background: transparent; color: #2270dd; }

.btn-content { display: inline-block; }
</style>
