<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import MsButton from '@/components/ms-button/MsButton.vue'
import MsPopup from '@/components/ms-popup/MsPopup.vue'
import MsTable from '@/components/ms-table/msTable.vue'
import CandidateForm from '@/views/candidates/CandidateForm.vue'
import { useDebounce } from '@vueuse/core'

const candidates = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const recordsPerPage = ref(10)
const showModal = ref(false)
const editingCandidate = ref(null)
const addModalRef = ref(null)

const columns = [
  { key: 'CandidateName', label: 'Họ và tên', type: 'text' },
  { key: 'Mobile', label: 'Số điện thoại', type: 'text' },
  { key: 'Email', label: 'Email' },
  { key: 'RecruitmentCampaignNames', label: 'Chiến dịch tuyển dụng' },
  { key: 'JobPositionName', label: 'Vị trí tuyển dụng' },
  { key: 'RecruitmentName', label: 'Tin tuyển dụng' },
  { key: 'RecruitmentRoundName', label: 'Vòng tuyển dụng' },
  { key: 'Score', label: 'Đánh giá', type: 'custom' },
  { key: 'ApplyDate', label: 'Ngày ứng tuyển', type: 'date' }
]

onMounted(() => {
  const saved = localStorage.getItem('candidateData')
  candidates.value = saved ? JSON.parse(saved) : []
})

const debouncedQuery = useDebounce(searchQuery, 500) 

const filteredCandidates = computed(() => {
  const query = debouncedQuery.value.toLowerCase()
  return candidates.value.filter(c =>
    c.CandidateName?.toLowerCase().includes(query) ||
    c.Mobile?.includes(query) ||
    c.Email?.toLowerCase().includes(query)
  )
})

function openAddModal() {
  editingCandidate.value = null
  showModal.value = true
  nextTick(() => addModalRef.value?.resetForm())
}

function openEditModal(candidate) {
  editingCandidate.value = candidate
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingCandidate.value = null
}
function saveCandidate() {
  if (addModalRef.value?.handleFormSave) {
    addModalRef.value.handleFormSave()
  }
}

function handleFormSubmit(payload) {
  if (!payload) return console.error('payload bị undefined!')

  if (editingCandidate.value) {
    const index = candidates.value.findIndex(c => c.CandidateID === payload.CandidateID)
    if (index !== -1) {
      candidates.value[index] = { ...payload }
    }
  } else {
    payload.CandidateID = Date.now()
    candidates.value.push(payload)
  }

  localStorage.setItem('candidateData', JSON.stringify(candidates.value))
  closeModal()
}

function confirmDelete(id) {
  if (confirm('Bạn có chắc muốn xóa ứng viên này?')) {
    candidates.value = candidates.value.filter(c => c.CandidateID !== id)
    localStorage.setItem('candidateData', JSON.stringify(candidates.value))
  }
}
</script>

<template>
    <section class="candidate-section">
        <div class="section-header">
            <h2>Danh sách ứng viên</h2>
            <MsButton leftIcon="fas fa-plus" rightIcon="fas fa-chevron-down" @click="openAddModal">Thêm ứng viên</MsButton>
        </div>

        <MsTable :data="filteredCandidates" :columns="columns" :show-actions="true" :show-checkbox="true"
            row-key="CandidateID" v-model:search-query="searchQuery" v-model:current-page="currentPage"
            v-model:records-per-page="recordsPerPage" :total-records="filteredCandidates.length" @edit="openEditModal"
            @delete="confirmDelete">
            <template #cell-Score="{ value }">
                <div class="rating-container">
                    <span v-for="n in Math.min(5, +value || 0)" :key="'a-' + n" class="star-active"></span>
                    <span v-for="n in Math.max(0, 5 - Math.min(5, +value || 0))" :key="'b-' + n"
                        class="star-inactive"></span>
                </div>
            </template>
        </MsTable>

        <MsPopup v-model:visible="showModal" :title="editingCandidate ? 'Sửa ứng viên' : 'Thêm ứng viên'"
            @save="saveCandidate" @close="closeModal">

            <template #content>
                <CandidateForm ref="addModalRef" :editing-candidate="editingCandidate" @save="handleFormSubmit" />
            </template>
        </MsPopup>

    </section>
</template>
<style scoped>
@import '../../assets/icon/icon.css';

.candidate-section {
    background-color: #ECEBF0;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.section-header h2 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-color);
}

.section-actions .add-candidate-btn {
    background-color: var(--button-bg);
    color: var(--button-text);
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 10px;
    display: flex;
    align-items: center;
    transition: background-color 0.2s ease;
}

.section-actions .add-candidate-btn:hover {
    background-color: #2270dd;
}

.section-actions .add-candidate-btn i {
    margin-right: 5px;
}

.section-actions .add-candidate-btn i.fa-chevron-down {
    margin-left: 10px;
    margin-right: 0;
}

.section-main {
    background-color: var(--top-header-bg);
    /* flex-grow: 1;  */
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    border-radius: 8px;
    overflow-x: visible;
    overflow-y: hidden;
}

.custom-add-btn {
    font-size: 12px;
    padding: 6px 12px;
    border-radius: 3px;
}
</style>
