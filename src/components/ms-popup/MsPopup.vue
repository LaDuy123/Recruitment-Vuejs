
<template>
  <div v-if="visible" class="modal" @click.self="emitClose">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <span class="close-button" @click="emitClose">&times;</span>
      </div>
      
      <div class="modal-body">
        <slot name="content"></slot>
      </div>
      
      <div class="modal-footer">
        <slot name="footer">
          <MsButton size="md" class="btn-cancel" @click="emitClose">Hủy</MsButton>
          <MsButton size="md" class="btn-save" @click="emitSave">Lưu</MsButton>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import MsButton from '@/components/ms-button/MsButton.vue'

const props = defineProps({
  visible: Boolean,
  title: { type: String, default: 'Modal' }
})

const emit = defineEmits(['update:visible', 'close', 'save'])

const emitClose = () => emit('update:visible', false)
const emitSave = () => emit('save')
</script>

<style scoped>
@import 'bootstrap/dist/css/bootstrap.min.css';

.modal {
  display: flex;
  position: fixed;
  z-index: 1001;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  border: 1px solid #e6e6e6;
  width: 520px;
  max-width: calc(100% - 40px);
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 5px 10px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--text-color);
}

.close-button {
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close-button:hover,
.close-button:focus {
  color: #333;
  text-decoration: none;
  cursor: pointer;
}

/* ⭐ THÊM 3 CLASS NÀY CHO BODY + FOOTER */
.modal-body {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
  overflow-y: auto;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background-color: #f5f5f5;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.modal-footer .btn-cancel,
.modal-footer .btn-save {
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.modal-footer .btn-cancel {
  background-color: #e0e0e0;
  color: var(--text-color);
  border: none;
}

.modal-footer .btn-cancel:hover {
  background-color: #ccc;
}

.modal-footer .btn-save {
  background-color: var(--primary-color);
  color: #fff;
  border: none;
}

.modal-footer .btn-save:hover {
  background-color: #2270dd;
}
</style>