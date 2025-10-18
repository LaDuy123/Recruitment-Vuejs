<template>
<div v-if="showFilterBar" class="filter-bar">
    <MsTextInput 
      v-model="localSearchInput" 
      :placeholder="searchPlaceholder"
      @enter="handleSearchEnter" 
      icon="fas fa-search" 
      class="filter-input" 
    />
    <MsIcon v-if="showFilterIcon" icon="filter" iconPack="custom" color="#666" />
    <MsIcon v-if="showExportIcon" @click="$emit('export')" icon="export" iconPack="custom" color="green" />
    <MsIcon v-if="showChartIcon" @click="$emit('chart')" icon="chart" iconPack="custom" color="#f44336" round />
    <MsIcon v-if="showSettingIcon" @click="$emit('setting')" icon="setting" iconPack="custom" />
  </div>

  <div class="ms-table">
    <table class="candidate-table">
      <thead class="sticky-header">
        <tr>
          <th v-if="showCheckbox">
            <slot name="checkbox-header"><input type="checkbox"></slot>
          </th>

          <th v-for="column in visibleColumns" :key="column.key" :class="column.sortable ? 'sortable' : ''"
            @click="column.sortable ? $emit('sort', column.key) : null">
            <slot :name="`head-${column.key}`" :column="column">
              {{ column.label }}
            </slot>
            <i v-if="column.sortable" :class="getSortIcon(column.key)" class="sort-icon"></i>
          </th>

          <th v-if="showActions">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in paginatedData" :key="row[rowKey] || rowIndex">
          <td v-if="showCheckbox">
            <slot name="checkbox" :row="row"><input type="checkbox"></slot>
          </td>

          <td v-for="column in visibleColumns" :key="column.key">
            <slot :name="`cell-${column.key}`" :row="row" :value="formatValue(row, column)" :column="column"
              :index="rowIndex">
              {{ formatValue(row, column) }}
            </slot>
          </td>

          <!-- ACTIONS -->
          <td v-if="showActions">
            <slot name="actions" :row="row">
              <i class="fas fa-edit edit-icon" @click="$emit('edit', row)" title="Sửa"></i>
              <i class="fas fa-trash-alt delete-icon" @click="$emit('delete', row[rowKey])" title="Xóa"></i>
            </slot>
          </td>
        </tr>

        <tr v-if="paginatedData.length === 0">
          <td :colspan="colspanCount" style="text-align:center;">
            <slot name="empty">{{ emptyMessage }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showPagination" class="pagination-footer">
    <span class="total-records">Tổng: {{ totalRecords }} bản ghi</span>
    <div class="pagination-controls">
      <span>Số bản ghi/trang</span>
      <select @change="handlePerPageChange" v-model="localRecordsPerPage">
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>
      <span>{{ currentRangeText }}</span>
      <button @click="prevPage" :disabled="localCurrentPage === 1">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button @click="nextPage" :disabled="localCurrentPage === totalPages || totalPages === 0">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import MsIcon from '../ms-icon/MsIcon.vue'
import MsTextInput from '../ms-textInput/MsTextInput.vue'
const props = defineProps({
  data: { type: Array, default: () => [] },
  columns: { type: Array, required: true },
  rowKey: { type: String, default: 'id' },
  emptyMessage: { type: String, default: 'Không có dữ liệu' },
  sortKey: { type: String, default: '' },
  sortOrder: { type: String, default: 'asc' },
  showCheckbox: { type: Boolean, default: false },
  showActions: { type: Boolean, default: false },
  error: String,

  totalRecords: { type: Number, default: 0 },
  currentPage: { type: Number, default: 1 },
  recordsPerPage: { type: Number, default: 10 },
  showPagination: { type: Boolean, default: true },

  showFilterBar: { type: Boolean, default: true },
  searchPlaceholder: { type: String, default: 'Tìm kiếm nhanh trong danh sách' },
  showFilterIcon: { type: Boolean, default: true },
  showExportIcon: { type: Boolean, default: true },
  showChartIcon: { type: Boolean, default: true },
  showSettingIcon: { type: Boolean, default: true },
  
  searchInput: { type: String, default: '' },
  searchQuery: { type: String, default: '' }
})

const emit = defineEmits([
  'sort', 'edit', 'delete', 'view',
  'update:currentPage',
  'update:recordsPerPage',
  'update:searchInput', 'update:searchQuery',
  'search', 'export', 'chart', 'setting'
])

const visibleColumns = computed(() => props.columns.filter(col => col.visible !== false))

const colspanCount = computed(() => {
  let count = visibleColumns.value.length
  if (props.showCheckbox) count++
  if (props.showActions) count++
  return count
})

const formatValue = (row, column) => {
  const rawValue = column.key.split('.').reduce((obj, k) => obj?.[k], row)
  if (rawValue === null || rawValue === undefined) return '--'
  if (column?.format) return column.format(rawValue)
  if (column?.type === 'text') return String(rawValue)
  const numValue = Number(rawValue)
  if (!isNaN(numValue)) {
    if (Number.isInteger(numValue)) {
      return column?.type === 'currency'
        ? numValue.toLocaleString('vi-VN') + 'đ'
        : numValue.toLocaleString('vi-VN')
    } else {
      return numValue.toLocaleString('vi-VN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
  }
  if (column?.type === 'date') {
    return new Date(rawValue).toLocaleDateString('vi-VN')
  }
  return rawValue || '--'
}

const getSortIcon = (key) => {
  if (props.sortKey !== key) return 'fas fa-sort'
  return props.sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'
}

//pagination
const localCurrentPage = computed({
  get: () => props.currentPage,
  set: (val) => emit('update:currentPage', val)
})

const localRecordsPerPage = computed({
  get: () => props.recordsPerPage,
  set: (val) => emit('update:recordsPerPage', val)
})

const totalPages = computed(() => Math.ceil(props.totalRecords / localRecordsPerPage.value) || 1)

const paginatedData = computed(() => {
  if (!props.data.length) return []
  const start = (localCurrentPage.value - 1) * localRecordsPerPage.value
  const end = start + localRecordsPerPage.value
  return props.data.slice(start, end)
})

const currentRangeText = computed(() => {
  const start = (localCurrentPage.value - 1) * localRecordsPerPage.value + 1
  const end = Math.min(localCurrentPage.value * localRecordsPerPage.value, props.totalRecords)
  return `${Math.min(start, props.totalRecords)} - ${end} bản ghi`
})

function prevPage() {
  if (localCurrentPage.value > 1) localCurrentPage.value--
}

function nextPage() {
  if (localCurrentPage.value < totalPages.value) localCurrentPage.value++
}

function handlePerPageChange() {
  localCurrentPage.value = 1
}
//filter
const localSearchInput = computed({
  get: () => props.searchQuery,
  set: (val) => emit('update:searchQuery', val)
})


function handleSearchEnter(value) {
  emit('update:searchQuery', value.trim())
  emit('search', value.trim()) 
}
</script>
<style scoped>
@import '../../assets/icon/icon.css';
.ms-table {
  overflow-x: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fff;
  flex-grow: 1;
  overflow-y: auto;
}

.sticky-header {
  position: sticky;
  top: 0;
  background-color: #f2f2f2;
  z-index: 10;
}

.candidate-table {
  width: 100%;
  min-width: fit-content;
  border-collapse: collapse;
  box-sizing: border-box;
}

.candidate-table th,
.candidate-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

.candidate-table th:first-child,
.candidate-table td:first-child {
  width: 50px;
}

.candidate-table th:last-child,
.candidate-table td:last-child {
  width: 120px;
  text-align: center;
}

.candidate-table th {
  background-color: var(--table-header-bg);
  font-weight: 600;
  color: var(--light-text-color);
  font-size: 10px;
}

.candidate-table .edit-icon,
.candidate-table .delete-icon {
  font-size: 16px;
  margin: 0 5px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.candidate-table .edit-icon {
  color: var(--primary-color);
}

.candidate-table .edit-icon:hover {
  color: #2270dd;
}

.candidate-table .delete-icon {
  color: var(--status-red);
}

.candidate-table .delete-icon:hover {
  color: #cc0000;
}

.candidate-table tbody tr:hover {
  background-color: var(--table-row-hover-bg);
}

.candidate-table tbody tr.highlighted {
  background-color: #fff5f5;
}

.candidate-table input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--primary-color);
}

/* ✅ SLOT STYLES */
:deep(.rating-container) {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* pagination */
.pagination-footer {
  position: sticky;
  bottom: 0;
  background-color: #f2f2f2;
  padding: 10px 20px;
  border-top: 1px solid var(--border-color);
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  font-size: 13px;
  color: var(--light-text-color);
  padding: 15px 0;
  background-color: var(--top-header-bg);
  border-top: 1px solid var(--border-color);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  margin-top: auto;
}

.pagination-controls {
  display: flex;
  align-items: center;
}

.pagination-controls span {
  margin: 0 5px;
}

.pagination-controls select {
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 5px 8px;
  font-size: 13px;
  margin: 0 5px;
  cursor: pointer;
  outline: none;
}

.pagination-controls button {
  background-color: var(--top-header-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 5px 10px;
  margin-left: 5px;
  cursor: pointer;
  color: var(--light-text-color);
  transition: background-color 0.2s ease;
}

.pagination-controls button:hover {
  background-color: var(--secondary-color);
}

.pagination-controls button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.total-records,
.pagination-controls {
  padding: 10px;
}

input.input-error:focus {
  border-color: red !important;
  outline: none;
}

/* filter */
.filter-bar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding: 8px 12px;
    background: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 4px;
    max-width: 100%;
}

.filter-input {
    width: 300px;
}

:deep(.filter-input .ms-input-field) {
    height: 30px;
    padding: 0 12px;
    font-size: 12px;
}

</style>