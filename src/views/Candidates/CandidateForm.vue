<script setup>
import { reactive, watch } from 'vue';

const props = defineProps(['showModal', 'editingCandidate']);
const emit = defineEmits(['close', 'save']);

defineExpose({ resetForm });


const genderList = [
  { value: '', label: 'Chọn giới tính' },
  { value: '1', label: 'Nam' },
  { value: '0', label: 'Nữ' },
  { value: '2', label: 'Khác' }
];

const locationList = [
  { value: '', label: 'Chọn khu vực' },
  { value: 'ha_noi', label: 'Hà Nội' },
  { value: 'ho_chi_minh', label: 'Hồ Chí Minh' },
  { value: 'da_nang', label: 'Đà Nẵng' },
  { value: 'can_tho', label: 'Cần Thơ' },
  { value: 'hai_phong', label: 'Hải Phòng' },
  { value: 'hue', label: 'Huế' }
];

const educationLevelList = [
  { value: '', label: 'Nhập trình độ đào tạo' },
  { value: '12/12', label: '12/12' },
  { value: 'cu_nhan', label: 'Cử nhân' },
  { value: 'ky_su', label: 'Kỹ sư' },
  { value: 'thac_sy', label: 'Thạc sỹ' },
  { value: 'tien_sy', label: 'Tiến sỹ' },
  { value: 'khac', label: 'Khác' }
];

const trainingPlaceList = [
  { value: '', label: 'Nhập nơi đào tạo' },
  { value: 'GTVT', label: 'Trường ĐH Giao Thông Vận Tải' },
  { value: 'BK', label: 'Trường ĐH Bách Khoa Hà Nội' },
  { value: 'KTQD', label: 'Trường ĐH Kinh tế Quốc dân' },
  { value: 'Khác', label: 'Khác' }
];

const majorList = [
  { value: '', label: 'Nhập chuyên ngành' },
  { value: 'CNTT', label: 'Công nghệ thông tin' },
  { value: 'KT', label: 'Kinh tế' },
  { value: 'QTKD', label: 'Quản trị kinh doanh' },
  { value: 'Khác', label: 'Khác' }
];

const sourceList = [
  { value: '', label: 'Chọn nguồn ứng viên' },
  { value: 'TDT', label: 'Tự đào tạo' },
  { value: 'PV', label: 'Thông qua phỏng vấn' },
  { value: 'TC', label: 'Được tiến cử' }
];

const collaboratorList = [
  { value: '', label: 'Chọn cộng tác viên' },
  { value: '1', label: 'Nguyễn Văn A' },
  { value: '2', label: 'Trần Thị B' },
  { value: '3', label: 'Lê Văn C' }
];

const referralList = [
  { value: '', label: 'Chọn nhân sự khai thác' },
  { value: '1', label: 'Đinh Nga QTHH' },
  { value: '2', label: 'Quang Huy QLTT' },
  { value: '3', label: 'Ngọc Anh QLPM' }
];


// Form (use keys matching backend object)
const formDefaults = {
  CandidateName: '', Mobile: '', Email: '', Address: '',
  Birthday: '', ApplyDate: '', CandidateType: '', AttractivePersonnel: '', CollaboratorName: '',
  WorkPlaceRecent: '', AreaName: '', EducationDegreeName: '', EducationPlaceName: '', EducationMajorName: '',
  CompanyName: '', StartDate: '', EndDate: '', JobPositionName: '', JobDescription: '',
  Gender: '', CandidateID: null,
  // UI-only
  addReferralToPool: false
};

const form = reactive({ ...formDefaults });

watch(() => props.editingCandidate, (candidate) => {
  Object.assign(form, mapCandidateToForm(candidate || {}));
}, { immediate: true });

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
  };
}

function formatDateISOToDMY(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function resetForm() { 
  Object.assign(form, { ...formDefaults }); 
}

function emitClose() { 
  emit('close'); 
}

function handleSave() { 
  if (!form.CandidateName.trim() || !form.ApplyDate) {
    return alert('Vui lòng nhập họ tên và ngày ứng tuyển');
  }

  const payload = {
    ...form,
    CandidateID: props.editingCandidate?.CandidateID || form.CandidateID || Date.now(),
    Birthday: parseDateDMYToISO(form.Birthday),
    ApplyDate: parseDateDMYToISO(form.ApplyDate),
    StartDate: parseDateDMYToISO(form.StartDate),
    EndDate: parseDateDMYToISO(form.EndDate),
    Gender: form.Gender === '' ? null : parseInt(form.Gender, 10)
  };

  emit('save', payload);
  emit('close');
}

function parseDateDMYToISO(dateStr) {
  if (!dateStr) return null;
  const [d, m, y] = dateStr.split('/').map(p => parseInt(p, 10));
  return isNaN(d) || isNaN(m) || isNaN(y) ? null : new Date(y, m - 1, d).toISOString();
}
</script>
<template>
  <div v-if="showModal" id="addCandidateModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ editingCandidate ? 'Sửa ứng viên' : 'Thêm ứng viên' }}</h2>
        <span class="close-button" @click="emitClose">&times;</span>
      </div>

      <div class="modal-body">
        <div class="form-section">
          <div class="row">
            <div class="col col-md-12">
              <msTextInput v-model="form.CandidateName" title="Họ và tên" placeholder="Nhập họ và tên" required id="fullName" />
            </div>
          </div>

          <div class="row">
            <div class="col col-md-6">
              <msDate v-model="form.Birthday" title="Ngày sinh" id="birthDate" placeholder="dd/MM/yyyy" />
            </div>
            <div class="col col-md-6">
              <msSelectList v-model="form.Gender" title="Giới tính" id="gender" :list="genderList" />
            </div>
          </div>

          <div class="row">
            <div class="col col-md-12">
              <msSelectList v-model="form.AreaName" title="Khu vực" id="location" :list="locationList" />
            </div>
          </div>
          <div class="row">
            <div class="col col-md-6">
              <msTextInput v-model="form.Mobile" title="Số điện thoại" placeholder="Nhập số điện thoại" type="tel" id="phoneNumber" />
            </div>
            <div class="col col-md-6">
              <msTextInput v-model="form.Email" title="Email" placeholder="Nhập email" type="email" id="email" />
            </div>
          </div>

          <div class="row">
            <div class="col col-md-12">
              <msTextInput v-model="form.Address" title="Địa chỉ" placeholder="Nhập địa chỉ" id="address" />
            </div>
          </div>
        </div>

        <div class="form-section education-section">
          <h3>HỌC VẤN</h3>
          <div class="row education-item">
            <div class="col col-md-4">
              <msSelectList v-model="form.EducationDegreeName" title="Trình độ đào tạo" required id="educationLevel" :list="educationLevelList" />
            </div>
            <div class="col col-md-4">
              <msSelectList v-model="form.EducationPlaceName" title="Nơi đào tạo" required id="trainingPlace" :list="trainingPlaceList" />
            </div>
            <div class="col col-md-4">
              <msSelectList v-model="form.EducationMajorName" title="Chuyên ngành" required id="major" :list="majorList" />
            </div>
          </div>
          <button class="add-more-btn" @click.prevent><i class="fas fa-plus"></i> Thêm học vấn</button>
        </div>

        <div class="form-section">
          <div class="row">
            <div class="col col-md-6">
              <msDate v-model="form.ApplyDate" title="Ngày ứng tuyển" placeholder="MM/yyyy" format="MM/yyyy" required id="applicationDate" />
            </div>
            <div class="col col-md-6">
              <msSelectList v-model="form.CandidateType" title="Nguồn ứng viên" id="source" :list="sourceList" />
            </div>
          </div>

          <div class="row">
            <div class="col col-md-6">
              <msSelectList v-model="form.AttractivePersonnel" title="Nhân sự khai thác" id="referral" :list="referralList" />
            </div>
            <div class="col col-md-6">
              <msSelectList v-model="form.CollaboratorName" title="Cộng tác viên"  id="collaboratorName" :list="collaboratorList" />
            </div>
          </div>

          <div class="checkbox-group">
            <input type="checkbox" v-model="form.addReferralToPool" id="addReferralToPool" />
            <label for="addReferralToPool">Thêm nhanh người tham chiếu</label>
          </div>


            <div class="col col-md-12">
              <msTextInput v-model="form.WorkPlaceRecent" title="Nơi làm việc gần đây" placeholder="Nhập nơi làm việc gần đây" id="recentCompany" />
            </div>
        </div>


        <div class="form-section experience-section">
          <div class="experience-item">

            <div class="col col-md-12">
              <msTextInput v-model="form.CompanyName" title="Nơi làm việc" placeholder="Nhập nơi làm việc" id="companyName" />
            </div>

            <div class="row">
              <div class="col col-md-6">
                <msDate v-model="form.StartDate" title="Từ" id="startDate" placeholder="MM/yyyy" format="MM/yyyy" />
              </div>
              <div class="col col-md-6">
                <msDate v-model="form.EndDate" title="Đến" id="endDate" placeholder="MM/yyyy" format="MM/yyyy" />
              </div>
            </div>


            <div class="col col-md-12">
              <msTextInput v-model="form.JobPositionName" title="Vị trí công việc" placeholder="Nhập vị trí công việc" id="position" />
            </div>
            <div class="col col-md-12">
              <msTextInput v-model="form.JobDescription" title="Mô tả công việc" placeholder="Nhập mô tả công việc" id="jobDescription" />
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <msButton size="md" icon="" class="btn-cancel" @click="emitClose">Hủy</msButton>
        <msButton size="md" icon="" class="btn-save" @click="handleSave">Lưu</msButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import 'bootstrap/dist/css/bootstrap.min.css';
/* --Thêm Ứng viên Modal-- */
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
  /* wider to match screenshots */
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

.modal-body {
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