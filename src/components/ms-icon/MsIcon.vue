<template>
  <!-- Nếu là font icon (Material hoặc FontAwesome) -->
  <i
    v-if="isFontIcon"
    :class="computedClass"
    :style="computedStyle"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <slot>{{ iconPack === 'material-icons' ? icon : '' }}</slot>
  </i>

  <span
    v-else
    :class="computedClass"
    :style="computedStyle"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: { type: String, required: true },          
  iconPack: { type: String, default: 'material-icons' }, 
  color: { type: String, default: null },
  bg: { type: String, default: null },
  size: { type: [String, Number], default: null },
  round: { type: Boolean, default: false },
})

const isFontIcon = computed(() => ['material-icons', 'fas', 'far', 'fab'].includes(props.iconPack))

const computedClass = computed(() => {
  const base = ['app-icon', props.iconPack]

  if (isFontIcon.value && props.iconPack !== 'material-icons') {
    base.push(props.icon)
  }

  if (!isFontIcon.value) {
    base.push(props.icon)
  }

  if (props.round) base.push('round')
  if (['small', 'medium', 'large'].includes(props.size)) base.push(`icon-${props.size}`)

  return base
})

const computedStyle = computed(() => {
  const style = {}

  if (typeof props.size === 'string' && /(px|em|rem)/.test(props.size)) {
    style.width = props.size
    style.height = props.size
    style.fontSize = props.size
  }

  if (props.color) style.color = props.color
  if (props.bg) style.background = props.bg

  return style
})
</script>

<style scoped>
/* 🌟 Base */
.app-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

/* 🌀 Round icon */
.app-icon.round {
  border-radius: 50%;
  padding: 6px;
}

/* 📏 Kích thước định nghĩa trước */
.app-icon.icon-small {
  font-size: 12px;
  width: 20px;
  height: 20px;
}
.app-icon.icon-medium {
  font-size: 16px;
  width: 28px;
  height: 28px;
}
.app-icon.icon-large {
  font-size: 20px;
  width: 36px;
  height: 36px;
}
</style>
