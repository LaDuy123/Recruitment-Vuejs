<script setup>
import MsTable from '@/components/msTable/msTable.vue'
import CandidateForm from '@/views/Candidates/CandidateForm.vue'
import { ref, computed, onMounted, watch } from 'vue'

const candidates = ref([])
const searchInput = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const recordsPerPage = ref(10)
const editingCandidate = ref(null)
const addModalRef = ref(null)
const showModal = ref(false)
const selectedCandidates = ref([]) // ✅ Thêm cho checkbox slot

// ✅ COLUMNS - GIỮ NGUYÊN + type đúng
const candidateColumns = [
    { key: 'CandidateName', label: 'Họ và tên', type: 'text' },
    { key: 'Mobile', label: 'Số điện thoại', type: 'text' },
    { key: 'Email', label: 'Email', type: 'text' },
    { key: 'RecruitmentCampaignNames', label: 'Chiến dịch tuyển dụng', type: 'text' },
    { key: 'JobPositionName', label: 'Vị trí', type: 'text' },
    { key: 'RecruitmentName', label: 'Tin tuyển dụng', type: 'text' },
    { key: 'RecruitmentRoundName', label: 'Vòng', type: 'text' },
    { key: 'Score', label: 'Đánh giá', type: 'custom' },
    { key: 'ApplyDate', label: 'Ngày ứng tuyển', type: 'date' }
]

// ✅ SORT
const sortKey = ref('')
const sortOrder = ref('asc')

onMounted(() => {
    const saved = localStorage.getItem('candidateData')
    candidates.value = saved ? JSON.parse(saved) : []
})

// ✅ FILTERED + SORT
const filteredCandidates = computed(() => {
    let result = [...candidates.value]

    // Search
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(c =>
            (c.CandidateName?.toLowerCase().includes(query)) ||
            (c.Mobile?.includes(query)) ||
            (c.Email?.toLowerCase().includes(query))
        )
    }

    // Sort
    if (sortKey.value) {
        result.sort((a, b) => {
            const aVal = getNestedValue(a, sortKey.value)
            const bVal = getNestedValue(b, sortKey.value)
            if (aVal === bVal) return 0
            const comparison = aVal > bVal ? 1 : -1
            return sortOrder.value === 'asc' ? comparison : -comparison
        })
    }

    return result
})

// ✅ PAGINATION
const totalPages = computed(() => Math.ceil(filteredCandidates.value.length / recordsPerPage.value) || 1)

const paginatedCandidates = computed(() => {
    if (!filteredCandidates.value.length) return []
    const start = (currentPage.value - 1) * recordsPerPage.value
    const end = start + recordsPerPage.value
    return filteredCandidates.value.slice(start, end)
})

const currentRangeText = computed(() => {
    const start = (currentPage.value - 1) * recordsPerPage.value + 1
    const end = Math.min(currentPage.value * recordsPerPage.value, filteredCandidates.value.length)
    return `${Math.min(start, filteredCandidates.value.length)} - ${end} bản ghi`
})

// ✅ WATCH - FIX BUG KHÔNG CÓ DATA
watch(filteredCandidates, () => {
    if (currentPage.value > totalPages.value) currentPage.value = 1
}, { immediate: true })

// ====== CONDITIONALS ======
function prevPage() {
    if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++
}

function handlePerPageChange(event) {
    recordsPerPage.value = parseInt(event.target.value)
    currentPage.value = 1
}

function handleSearchEnter() {
    searchQuery.value = searchInput.value.trim()
    currentPage.value = 1
}

// ====== MODAL ======
function openAddModal() {
    editingCandidate.value = null
    showModal.value = true
    addModalRef.value?.resetForm()
}

function openEditModal(candidate) {
    editingCandidate.value = candidate
    showModal.value = true
}

function closeModal() {
    showModal.value = false
    editingCandidate.value = null
}

function saveCandidate(candidateData) {
    const idx = candidates.value.findIndex(c => c.CandidateID === candidateData.CandidateID)
    if (idx !== -1) {
        candidates.value[idx] = { ...candidates.value[idx], ...candidateData }
    } else {
        candidates.value.push(candidateData)
    }
    localStorage.setItem('candidateData', JSON.stringify(candidates.value))
    closeModal()
}

// ✅ HELPERS CHO SLOTS
function getNestedValue(row, key) {
    return key.split('.').reduce((obj, k) => obj?.[k], row)
}

const isRecentDate = (dateStr) => {
    if (!dateStr) return false
    return (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24) <= 7
}

const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : '--'

const truncateText = (text, max) => text?.length > max ? text.slice(0, max) + '...' : text

function confirmDelete(id) {
    if (confirm(`Bạn có chắc muốn xóa ứng viên: ${id}?`)) {
        candidates.value = candidates.value.filter(c => c.CandidateID !== id)
        localStorage.setItem('candidateData', JSON.stringify(candidates.value))
    }
}

const viewDetails = (row) => console.log('View details:', row)

// ✅ EXPOSE CHO SLOTS - KHÔNG LỖI!
defineExpose({
    isRecentDate,
    formatDate,
    truncateText,
    confirmDelete,
    viewDetails,
    openEditModal,
    openAddModal
})
</script>
<template>
    <section class="candidate-section">
        <div class="section-header">
            <h2>Ứng viên</h2>
            <div class="section-actions">
                <button class="add-candidate-btn" @click="openAddModal"><i class="fas fa-plus"></i> Thêm ứng viên <i
                        class="fas fa-chevron-down"></i></button>
            </div>
        </div>
        <div class="section-main">
            <div class="filter-bar">
                <div class="search-input">
                    <i class="fas fa-search"></i>
                    <input type="text" v-model="searchInput" placeholder="Tìm kiếm nhanh trong danh sách"
                        @keydown.enter="handleSearchEnter" />
                </div>
                <div class="filter-icons">
                    <i class="fas fa-filter"></i>
                    <i class="fas fa-bars"></i>
                    <i class="fas fa-cog"></i>
                </div>
            </div>

            <MsTable :data="paginatedCandidates" :columns="candidateColumns" :show-checkbox="true" :show-actions="true"
                :row-key="'CandidateID'" @edit="openEditModal" @delete="confirmDelete">
                <template #cell-Score="{ value }">
                    <div class="rating-container">
                        <span v-for="n in (value || 0)" :key="'active-' + n" class="star-active"></span>
                        <span v-for="n in (5 - (value || 0))" :key="'inactive-' + n" class="star-inactive"></span>
                    </div>
                </template>
                <template #checkbox="{ row }">
                    <input type="checkbox" v-model="selected" :value="row.id" />
                </template>
                <template #actions="{ row }">
                    <!-- <i class="fas fa-edit" @click="openEditModal(row)"></i> -->
                    <!-- <i class="fas fa-trash-alt" @click="confirmDelete(row.CandidateID)"></i>
                    <i class="fas fa-eye" @click="viewDetails(row)"></i> -->
                </template>
            </MsTable>

            <div class="pagination-footer">
                <span class="total-records">Tổng: {{ filteredCandidates.length }} bản ghi</span>
                <div class="pagination-controls">
                    <span>Số bản ghi/trang</span>
                    <select @change="handlePerPageChange" :value="recordsPerPage">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                    <span>{{ currentRangeText }}</span>
                    <button @click="prevPage" :disabled="currentPage === 1">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    </section>
    <CandidateForm ref="addModalRef" :show-modal="showModal" :editing-candidate="editingCandidate" @close="closeModal"
        @save="saveCandidate" />
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

.filter-bar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    padding: 10px;
    background-color: var(--top-header-bg);
    border-top: 1px solid var(--border-color);
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    margin-top: auto;
}

.filter-bar .search-input {
    display: flex;
    align-items: center;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    padding: 5px 10px;
    width: 300px;
}

.filter-bar .search-input i {
    color: var(--light-text-color);
    margin-right: 10px;
}

.filter-bar .search-input input {
    border: none;
    background: transparent;
    outline: none;
    flex-grow: 1;
    font-size: 10px;
    color: var(--text-color);
}

.filter-bar .filter-icons i {
    margin-left: 15px;
    color: var(--light-text-color);
    cursor: pointer;
    font-size: 16px;
}


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
</style>
