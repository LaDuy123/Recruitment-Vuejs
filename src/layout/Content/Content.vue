<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  padded: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
    <slot />
</template>

<style scoped>

</style>
