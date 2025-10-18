<template>
  <button
    :class="['ms-button', `ms-button--${type}`, { 'ms-button--disabled': disabled }]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <i v-if="leftIcon" class="ms-button__icon ms-button__icon--left fa" :class="leftIcon"></i>

    <span class="ms-button__content">
      <slot></slot>
    </span>
    
    <i v-if="rightIcon" class="ms-button__icon ms-button__icon--right fa" :class="rightIcon"></i>
  </button>
</template>

<script setup>
const props = defineProps({
  leftIcon: {
    type: String,
    default: null,
  },
  rightIcon: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    default: 'primary',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.ms-button {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.ms-button--primary {
  background-color: #1976d2;
  color: white;
}

.ms-button--link {
  background: none;
  color: #1976d2;
  padding: 0;
}

.ms-button--warning {
  background-color: #ff9800;
  color: white;
}

.ms-button--danger {
  background-color: #dc3545;
  color: white;
}

.ms-button__content {
  white-space: nowrap;
}

.ms-button__icon {
  display: inline-flex;
  align-items: center;
}

.ms-button__icon--left {
  margin-right: 8px;
}

.ms-button__icon--right {
  margin-left: 8px;
}
</style>