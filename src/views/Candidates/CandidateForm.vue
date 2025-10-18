<script setup>
import { reactive, watch } from 'vue'
import { validator } from '@/utils/validatorfn.js'
import MsTextInput from '@/components/ms-textInput/MsTextInput.vue'
import MsSelectList from '@/components/ms-selectList/MsSelectList.vue'
import MsDate from '@/components/ms-date/MsDate.vue'
import MsButton from '@/components/ms-button/MsButton.vue'

const props = defineProps(['editingCandidate']) 
const emit = defineEmits(['close', 'save'])

const { form: validatorForm, errors, isValid, validateForm, reset: resetValidator } = validator()

const validationConfig = {
  CandidateName: { rules: ['required'], label: 'Họ và tên' },
  ApplyDate: { rules: ['required'], label: 'Ngày ứng tuyển' },
  Mobile: { rules: ['phone'], label: 'Số điện thoại' },
  Email: { rules: ['email'], label: 'Email' }
}

const genderList = [
  { value: '', label: 'Chọn giới tính' },
  { value: '1', label: 'Nam' },
  { value: '0', label: 'Nữ' },
  { value: '2', label: 'Khác' }
]

const locationList = [
  { value: '', label: 'Chọn khu vực' },
  { value: 'ha_noi', label: 'Hà Nội' },
  { value: 'ho_chi_minh', label: 'Hồ Chí Minh' },
  { value: 'da_nang', label: 'Đà Nẵng' },
  { value: 'can_tho', label: 'Cần Thơ' },
  { value: 'hai_phong', label: 'Hải Phòng' },
  { value: 'hue', label: 'Huế' }
]

const educationLevelList = [
  { value: '', label: 'Nhập trình độ đào tạo' },
  { value: '12/12', label: '12/12' },
  { value: 'cu_nhan', label: 'Cử nhân' },
  { value: 'ky_su', label: 'Kỹ sư' },
  { value: 'thac_sy', label: 'Thạc sỹ' },
  { value: 'tien_sy', label: 'Tiến sỹ' },
  { value: 'khac', label: 'Khác' }
]

const trainingPlaceList = [
  { value: '', label: 'Nhập nơi đào tạo' },
  { value: 'GTVT', label: 'Trường ĐH Giao Thông Vận Tải' },
  { value: 'BK', label: 'Trường ĐH Bách Khoa Hà Nội' },
  { value: 'KTQD', label: 'Trường ĐH Kinh tế Quốc dân' },
  { value: 'Khác', label: 'Khác' }
]

const majorList = [
  { value: '', label: 'Nhập chuyên ngành' },
  { value: 'CNTT', label: 'Công nghệ thông tin' },
  { value: 'KT', label: 'Kinh tế' },
  { value: 'QTKD', label: 'Quản trị kinh doanh' },
  { value: 'Khác', label: 'Khác' }
]

const sourceList = [
  { value: '', label: 'Chọn nguồn ứng viên' },
  { value: 'TDT', label: 'Tự đào tạo' },
  { value: 'PV', label: 'Thông qua phỏng vấn' },
  { value: 'TC', label: 'Được tiến cử' }
]

const collaboratorList = [
  { value: '', label: 'Chọn cộng tác viên' },
  { value: '1', label: 'Nguyễn Văn A' },
  { value: '2', label: 'Trần Thị B' },
  { value: '3', label: 'Lê Văn C' }
]

const referralList = [
  { value: '', label: 'Chọn nhân sự khai thác' },
  { value: '1', label: 'Đinh Nga QTHH' },
  { value: '2', label: 'Quang Huy QLTT' },
  { value: '3', label: 'Ngọc Anh QLPM' }
]

const formDefaults = {
  CandidateName: '', Mobile: '', Email: '', Address: '',
  Birthday: '', ApplyDate: '', CandidateType: '', AttractivePersonnel: '', CollaboratorName: '',
  WorkPlaceRecent: '', AreaName: '', EducationDegreeName: '', EducationPlaceName: '', EducationMajorName: '',
  CompanyName: '', StartDate: '', EndDate: '', JobPositionName: '', JobDescription: '',
  Gender: '', CandidateID: null,
  addReferralToPool: false
}

const form = validatorForm.value

watch(() => form, (newForm) => {
  validatorForm.value = newForm
}, { deep: true, immediate: true })

watch(() => props.editingCandidate, (candidate) => {
  Object.assign(validatorForm.value, mapCandidateToForm(candidate || {}))
}, { immediate: true })

function mapCandidateToForm(candidate) {
  return {
    CandidateName: candidate.CandidateName || '',
    Mobile: candidate.Mobile || '',
    Email: candidate.Email || '',
    AreaName: candidate.AreaName || '',
    Address: candidate.Address || '',
    Gender: candidate.Gender != null ? String(candidate.Gender) : '',
    Birthday: formatDateISOToDMY(candidate.Birthday),
    ApplyDate: formatDateISOToDMY(candidate.ApplyDate),
    EducationDegreeName: candidate.EducationDegreeName || '',
    EducationPlaceName: candidate.EducationPlaceName || '',
    EducationMajorName: candidate.EducationMajorName || '',
    CandidateType: candidate.CandidateType || '',
    AttractivePersonnel: candidate.AttractivePersonnel || '',
    CollaboratorName: candidate.CollaboratorName || '',
    WorkPlaceRecent: candidate.WorkPlaceRecent || '',
    CompanyName: candidate.CompanyName || '',
    JobPositionName: candidate.JobPositionName || '',
    JobDescription: candidate.JobDescription || '',
    StartDate: formatDateISOToDMY(candidate.StartDate),
    EndDate: formatDateISOToDMY(candidate.EndDate),
    CandidateID: candidate.CandidateID || null
  }
}

function formatDateISOToDMY(isoDate) {
  if (!isoDate) return ''
  const d = new Date(isoDate)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function resetForm() { 
  Object.assign(validatorForm.value, { ...formDefaults }) 
  resetValidator() 
}

function handleSave() { 
 const isFormValid = validateForm(validationConfig) 
  if (!isFormValid) return

  const payload = {
     ...validatorForm.value,
    CandidateID: props.editingCandidate?.CandidateID || form.CandidateID || Date.now(),
    Birthday: parseDateDMYToISO(form.Birthday),
    ApplyDate: parseDateDMYToISO(form.ApplyDate),
    StartDate: parseDateDMYToISO(form.StartDate),
    EndDate: parseDateDMYToISO(form.EndDate),
    Gender: form.Gender === '' ? null : parseInt(form.Gender, 10)
  }

  emit('save', payload)
}

function parseDateDMYToISO(dateStr) {
  if (!dateStr) return null
  const [d, m, y] = dateStr.split('/').map(p => parseInt(p, 10))
  return isNaN(d) || isNaN(m) || isNaN(y) ? null : new Date(y, m - 1, d).toISOString()
}

const handleFormSave = () => handleSave()

defineExpose({ resetForm, handleFormSave })
</script>
<template>
      <div class="candidate-form-container">
        <div class="form-section">
          <div class="row">
            <div class="col col-md-12">
              <MsTextInput 
                v-model="form.CandidateName" 
                label="Họ và tên" 
                placeholder="Nhập họ và tên" 
                required 
                :error="errors.CandidateName"
              />
            </div>
          </div>

          <div class="row">
            <div class="col col-md-6">
              <MsDate v-model="form.Birthday" title="Ngày sinh" id="birthDate" placeholder="dd/MM/yyyy" />
            </div>
            <div class="col col-md-6">
              <MsSelectList v-model="form.Gender" title="Giới tính" id="gender" :list="genderList" />
            </div>
          </div>

          <div class="row">
            <div class="col col-md-12">
              <MsSelectList v-model="form.AreaName" title="Khu vực" id="location" :list="locationList" />
            </div>
          </div>
          <div class="row">
            <div class="col col-md-6">
              <MsTextInput 
                v-model="form.Mobile" 
                label="Số điện thoại" 
                placeholder="Nhập số điện thoại" 
                type="tel" 
                :error="errors.Mobile"
              />
            </div>
            <div class="col col-md-6">
              <MsTextInput 
                v-model="form.Email" 
                label="Email" 
                placeholder="Nhập email" 
                type="email" 
                :error="errors.Email"
              />
            </div>
          </div>

          <div class="row">
            <div class="col col-md-12">
              <MsTextInput v-model="form.Address" label="Địa chỉ" placeholder="Nhập địa chỉ" id="address" />
            </div>
          </div>
        </div>

        <div class="form-section education-section">
          <h3>HỌC VẤN</h3>
          <div class="row education-item">
            <div class="col col-md-4">
              <MsSelectList v-model="form.EducationDegreeName" title="Trình độ đào tạo" required id="educationLevel" :list="educationLevelList" />
            </div>
            <div class="col col-md-4">
              <MsSelectList v-model="form.EducationPlaceName" title="Nơi đào tạo" required id="trainingPlace" :list="trainingPlaceList" />
            </div>
            <div class="col col-md-4">
              <MsSelectList v-model="form.EducationMajorName" title="Chuyên ngành" required id="major" :list="majorList" />
            </div>
          </div>
          <button class="add-more-btn" @click.prevent><i class="fas fa-plus"></i> Thêm học vấn</button>
        </div>

        <div class="form-section">
          <div class="row">
            <div class="col col-md-6">
              <MsDate 
                v-model="form.ApplyDate" 
                title="Ngày ứng tuyển" 
                placeholder="dd/MM/yyyy" 
                required 
                :error="errors.ApplyDate"
              />
            </div>
            <div class="col col-md-6">
              <MsSelectList v-model="form.CandidateType" title="Nguồn ứng viên" id="source" :list="sourceList" />
            </div>
          </div>

          <div class="row">
            <div class="col col-md-6">
              <MsSelectList v-model="form.AttractivePersonnel" title="Nhân sự khai thác" id="referral" :list="referralList" />
            </div>
            <div class="col col-md-6">
              <MsSelectList v-model="form.CollaboratorName" title="Cộng tác viên"  id="collaboratorName" :list="collaboratorList" />
            </div>
          </div>

          <div class="checkbox-group">
            <input type="checkbox" v-model="form.addReferralToPool" id="addReferralToPool" />
            <label for="addReferralToPool">Thêm nhanh người tham chiếu</label>
          </div>


            <div class="col col-md-12">
              <MsTextInput v-model="form.WorkPlaceRecent" label="Nơi làm việc gần đây" placeholder="Nhập nơi làm việc gần đây" id="recentCompany" />
            </div>
        </div>
        <div class="form-section experience-section">
          <div class="experience-item">

            <div class="col col-md-12">
              <MsTextInput v-model="form.CompanyName" label="Nơi làm việc" placeholder="Nhập nơi làm việc" id="companyName" />
            </div>

            <div class="row">
              <div class="col col-md-6">
                <MsDate v-model="form.StartDate" title="Từ" id="startDate" placeholder="MM/yyyy" format="MM/yyyy" />
              </div>
              <div class="col col-md-6">
                <MsDate v-model="form.EndDate" title="Đến" id="endDate" placeholder="MM/yyyy" format="MM/yyyy" />
              </div>
            </div>


            <div class="col col-md-12">
              <MsTextInput v-model="form.JobPositionName" label="Vị trí công việc" placeholder="Nhập vị trí công việc" id="position" />
            </div>
            <div class="col col-md-12">
              <MsTextInput v-model="form.JobDescription" label="Mô tả công việc" placeholder="Nhập mô tả công việc" id="jobDescription" />
            </div>
          </div>
        </div>
      </div>
</template>

<style scoped>
@import 'bootstrap/dist/css/bootstrap.min.css';

.candidate-form-container {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
  overflow-y: auto;
}

.form-section {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
}

.form-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  /* allow columns to wrap when needed */
}

.add-more-btn {
  background-color: transparent;
  border: none;
  color: #1a73e8;
  cursor: pointer;
  padding: 5px 0;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 500;
}

.add-more-btn.add-referral-btn {
  margin-top: 15px;
  margin-bottom: 10px;
  width: fit-content;
}

.add-more-btn i {
  font-size: 12px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 8px;
  margin-top: 10px;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
}

.checkbox-group label {
  margin-bottom: 0;
  font-weight: normal;
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
  transition: background-color 0.2s ease, color 0.2s ease;
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

.custom-dropdown-list {
  position: absolute;
  background-color: #fff;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  top: calc(100% + 5px);
  left: 0;
}
</style>