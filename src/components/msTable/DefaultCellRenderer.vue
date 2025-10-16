<template>
  <!-- ✅ CHỈ 2 KIỂU CƠ BẢN -->
  <span v-if="column.type === 'date'">
    {{ value ? new Date(value).toLocaleDateString('vi-VN') : '--' }}
  </span>
  <span v-else>
    {{ formatValue(value) || '--' }}
  </span>
</template>

<script setup>
const props = defineProps({
  value: [String, Number, Date],
  column: Object,
  row: Object
})

const formatValue = (value) => {
  return props.column.format ? props.column.format(value) : value
}
</script>