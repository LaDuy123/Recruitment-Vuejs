<template>
  <div class="table-responsive">
    <table class="candidate-table">
      <thead class="sticky-header">
        <tr>
          <!-- CHECKBOX -->
          <th v-if="showCheckbox">
            <slot name="checkbox-header"><input type="checkbox"></slot>
          </th>
          
          <!-- DYNAMIC COLUMNS - AUTO WIDTH -->
          <th 
            v-for="(column, index) in visibleColumns" 
            :key="index"
            :class="column.sortable ? 'sortable' : ''"
            @click="column.sortable ? $emit('sort', column.key) : null"
          >
            <span>{{ column.label }}</span>
            <i v-if="column.sortable" :class="getSortIcon(column.key)" class="sort-icon"></i>
          </th>
          
          <!-- ACTIONS -->
          <th v-if="showActions">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="row[rowKey] || rowIndex">
          <!-- CHECKBOX -->
          <td v-if="showCheckbox">
            <slot name="checkbox" :row="row"><input type="checkbox"></slot>
          </td>
          
          <!-- DYNAMIC CELLS - AUTO WIDTH -->
          <td v-for="(column, colIndex) in visibleColumns" :key="colIndex">
            <slot :name="`cell-${column.key}`" :row="row" :value="getCellValue(row, column.key)" :column="column" :index="rowIndex">
              <DefaultCellRenderer :value="getCellValue(row, column.key)" :column="column" :row="row" />
            </slot>
          </td>
          
          <!-- ACTIONS -->
          <td v-if="showActions">
            <slot name="actions" :row="row">
              <i class="fas fa-edit edit-icon" @click="$emit('edit', row)"></i>
              <i class="fas fa-trash-alt delete-icon" @click="$emit('delete', row[rowKey])"></i>
            </slot>
          </td>
        </tr>
        
        <tr v-if="data.length === 0">
          <td :colspan="colspanCount" style="text-align:center;">
            <slot name="empty">{{ emptyMessage }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DefaultCellRenderer from './DefaultCellRenderer.vue'

const props = defineProps({
  data: { type: Array, default: () => [] },
  columns: { type: Array, required: true },
  rowKey: { type: String, default: 'id' },
  emptyMessage: { type: String, default: 'Không có dữ liệu' },
  sortKey: { type: String, default: '' },
  sortOrder: { type: String, default: 'asc' },
  // ✅ PROPS MỚI - ĐƠN GIẢN!
  showCheckbox: { type: Boolean, default: false },
  showActions: { type: Boolean, default: false }
})

const emit = defineEmits(['sort', 'edit', 'delete'])

const visibleColumns = computed(() => props.columns.filter(col => col.visible !== false))

// ✅ SIMPLIFIED - KHÔNG DÙNG $slots!
const hasCheckbox = computed(() => props.showCheckbox)
const hasActions = computed(() => props.showActions)

const colspanCount = computed(() => {
  let count = visibleColumns.value.length
  if (hasCheckbox.value) count++
  if (hasActions.value) count++
  return count
})

const getCellValue = (row, key) => key.split('.').reduce((obj, k) => obj?.[k], row)

const getSortIcon = (key) => {
  if (props.sortKey !== key) return 'fas fa-sort'
  return props.sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'
}
</script>
<style scoped>
.table-responsive {
    overflow-x: auto; /* ✅ SCROLL X */
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
    min-width: fit-content; /* ✅ CONTENT QUYẾT WIDTH */
    border-collapse: collapse;
    box-sizing: border-box; 
}

.candidate-table th,
.candidate-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
    white-space: nowrap; /* ✅ KHÔNG WRAP */
}

/* ✅ AUTO WIDTH - KHÔNG CỐ ĐỊNH */
.candidate-table th:first-child,
.candidate-table td:first-child {
    width: 50px; /* Checkbox nhỏ gọn */
}

.candidate-table th:last-child,
.candidate-table td:last-child {
    width: 120px; /* Actions cố định */
    text-align: center;
}

/* ✅ DYNAMIC COLUMNS - TỰ ĐOÁN */
.candidate-table th:not(:first-child):not(:last-child),
.candidate-table td:not(:first-child):not(:last-child) {
    /* AUTO theo content - KHÔNG set width */
}

.candidate-table th {
    background-color: var(--table-header-bg);
    font-weight: 600;
    color: var(--light-text-color);
    text-transform: uppercase;
    font-size: 10px;
}

.candidate-table .edit-icon,
.candidate-table .delete-icon {
    font-size: 16px;
    margin: 0 5px;
    cursor: pointer;
    transition: color 0.2s ease;
}

.candidate-table .edit-icon { color: var(--primary-color); }
.candidate-table .edit-icon:hover { color: #2270dd; }
.candidate-table .delete-icon { color: var(--status-red); }
.candidate-table .delete-icon:hover { color: #cc0000; }

.candidate-table tbody tr:hover { background-color: var(--table-row-hover-bg); }
.candidate-table tbody tr.highlighted { background-color: #fff5f5; }

.candidate-table input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: var(--primary-color);
}

.stars { color: #FFC107; font-size: 16px; }
.stars.unrated { color: var(--unrated-star-color); }

/* ✅ SLOT STYLES */
:deep(.rating-container) { display: flex; align-items: center; gap: 4px; }
:deep(.rating-text) { font-size: 10px; color: #666; }
:deep(.date-new) { color: #10b981; font-weight: 600; }
:deep(.truncate-text) { 
    max-width: 100%; 
    overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: nowrap; 
}
:deep(.view-icon) { color: #6b7280; margin-left: 8px; }
:deep(.view-icon:hover) { color: #3b82f6; }
:deep(.empty-state) { padding: 40px; text-align: center; }
:deep(.btn-add-empty) { 
    background: var(--primary-color); 
    color: white; 
    border: none; 
    padding: 8px 16px; 
    border-radius: 4px; 
    margin-top: 8px; 
    cursor: pointer; 
}
</style>