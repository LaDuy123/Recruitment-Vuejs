<template>
  <li :class="{ active: isActive }">
    <router-link v-if="to" :to="to" class="nav-link" :title="label">
      <i v-if="icon" :class="icon"></i>
      <span v-if="!collapsed" class="label-text">{{ label }}</span>
      <span v-if="badge" class="badge">{{ badge }}</span>
    </router-link>

    <a v-else href="#" @click.prevent="handleClick" :title="label">
      <i v-if="icon" :class="icon"></i>
      <span v-if="!collapsed" class="label-text">{{ label }}</span>
      <span v-if="badge" class="badge">{{ badge }}</span>
    </a>
  </li>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  icon: { type: String, default: '' },
  label: { type: String, default: '' },
  to: { type: String, default: '' },
  active: { type: Boolean, default: false },
  badge: { type: [String, Number], default: null },
  collapsed: { type: Boolean, default: false }
})

const emit = defineEmits(['navigate'])

const router = useRouter()
const route = useRoute()

const isActive = computed(() => {
  if (props.to) {
    // exact path match
    if (route.path === props.to) return true
    // if `to` might be a route name
    if (route.name && route.name === props.to) return true
  }
  return props.active
})

function handleClick() {
  if (props.to) {
    router.push(props.to)
    return
  }
  emit('navigate', props.to)
}
</script>

<style scoped>
.badge {
  background: rgba(255,255,255,0.12);
  color: #fff;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  margin-left: 8px;
}

.label-text { margin-left: 8px; font-size: 12px; }

li a { display:flex; align-items:center; gap:8px; padding: 4px 5px; border-radius: 8px; color: rgba(255,255,255,0.85); text-decoration: none; }

li a i { font-size: 16px; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.9); }

/* inactive state - muted icons/text */
li:not(.active) a { color: rgba(255,255,255,0.75); }
li:not(.active) a i { color: rgba(255,255,255,0.6); }

li a:hover { background: rgba(255,255,255,0.05); color: #fff; }

/* active state - blue rounded background */
li.active a { background: linear-gradient(180deg,#2d8bf7,#1d6fee); color: #fff; box-shadow: 0 2px 6px rgba(29,111,238,0.18); }
li.active a i { color: #fff; }

/* collapsed: keep icon centered and hide label via prop/parent */
.label-text[style*="display: none"] { display: none; }
</style>
