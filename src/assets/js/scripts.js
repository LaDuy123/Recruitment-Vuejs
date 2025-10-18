const firstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Đặng", "Bùi"];
const middleNames = ["Văn", "Thị", "Mỹ", "Hữu", "Quang", "Kim", "Minh", "Thanh", "Anh", "Diệu"];
const lastNames = ["An", "Bình", "Cường", "Dung", "Hà", "Khanh", "Linh", "Long", "Ngọc", "Phúc", "Quyên", "Sơn", "Thảo", "Uyên", "Việt", "Xuân"];

const jobPositions = [
    "QC /Tester/Kiểm thử phần mềm",
    "Nhân viên kinh doanh HO",
    "Kỹ sư phần mềm Java",
    "Chuyên viên Marketing",
    "Kế toán tổng hợp",
    "Thiết kế đồ họa",
    "Trợ lý hành chính",
    "Chuyên viên tư vấn tài chính",
    "Nhân viên chăm sóc khách hàng",
    "Project Manager"
];

const recruitmentCampaigns = [
    "Chiến dịch tuyển dụng Q3 2025",
    "Chiến dịch tuyển dụng Tester/QC",
    "Chiến dịch tuyển dụng Sales",
    "Chiến dịch tuyển dụng IT cao cấp"
];

const recruitmentNames = [
    "QC/Tester HN, HCM",
    "Sales Executive Hà Nội",
    "Java Developer Hồ Chí Minh",
    "Marketing Specialist Đà Nẵng",
    "Kế toán viên Đồng Nai"
];

const recruitmentRounds = [
    "Ứng tuyển",
    "Phỏng vấn vòng 1",
    "Phỏng vấn vòng 2",
    "Thi tuyển",
    "Offer",
    "Đã tuyển",
    "Từ chối"
];

const attractivePersonnelNames = [
    "Nguyễn Thị Thảo",
    "Trần Văn Anh",
    "Lê Minh Quân",
    "Phạm Thị Kim Ngân"
];

const addresses = [
    "Hà Nội",
    "TP. Hồ Chí Minh",
    "Đà Nẵng",
    "Hải Phòng",
    "Cần Thơ",
    "Đồng Nai",
    "Bình Dương",
    "Vũng Tàu",
    "Nha Trang",
    "Huế"
];

const originalCandidate = {
    CountTask: null,
    CandidateName: "Tạ Long Khánh",
    Mobile: "0921023567",
    Email: "trangthu.tester@gmail.com",
    RecruitmentCampaignNames: null,
    JobPositionName: "QC /Tester/Kiểm thử phần mềm",
    RecruitmentName: "QC/Tester HN, HCM Quý 3.2025",
    RecruitmentRoundName: "Offer",
    Score: 0,
    ApplyDate: "2025-08-19T10:01:31.379+07:00",
    ChannelName: null,
    EducationDegreeName: null,
    EducationPlaceName: null,
    EducationMajorName: null,
    WorkPlaceRecent: null,
    CompanyName: null,
    JobDescription: null,
    StartDate: null,
    EndDate: null,
    AttractivePersonnel: "Dương Thị Thảo",
    OrganizationUnitName: null,
    Overall: null,
    AreaName: null,
    PresenterName: null,
    ProbationInfoStatus: null,
    IsTalentPoolDetail: null,
    AccountPortal: null,
    TagInfos: null,
    CandidateStatusID: 1,
    Gender: 1,
    Birthday: null,
    Address: "",
    ReasonRemoved: null,
    CollaboratorName: null,
    HireDate: null,
    OfferStatus: 1,
    RecruitmentChannelID: null,
    CandidateID: "593265", 
    RecruitmentID: 20962,
    Avatar: null,
    AvatarColor: "#EDC201",
    Active: 1,
    CandidateStatusName: null,
    IsNew: 0,
    IsSelfUpdate: 0,
    IsNewProbationInfo: 0,
    IsSentProbationInfo: 0,
    RecruitmentStatusReal: 5,
    RecruitmentStatus: 5,
    IsOutOfCapcity: null,
    BirthdayFormat: 3,
    MonthOfBirthday: 1,
    YearOfBirthday: 1970,
    IsMultiNews: 0,
    IsEmployee: null,
    CustomInforFields: "{}",
    PresenterOUID: null,
    PresenterOUName: null,
    CandidateType: 0,
    UnreadEmailQuantity: 0,
    EmployeeBlackListIDs: null,
    RecruitmentCampaignIDs: null,
    CandidateConvertID: "d1fa29d8-7ca8-11f0-a2ee-005056b252e4",
    SentPropose: null,
    UnreadCommentQuantity: 0,
    StatusTrain: null,
    IsSendTrain: null,
    ProposeOfferStatus: 2,
    IsDuplicate: 0,
};

/**
 * Trả về một phần tử ngẫu nhiên từ một mảng.
 * @param {Array<any>} arr - Mảng chứa các phần tử.
 * @returns {any} - Một phần tử ngẫu nhiên từ mảng.
 * Created By LHDuy - 13/10/2025
 */
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Tạo dữ liệu ứng viên giả định với thông tin ngẫu nhiên.
 * @param {number} index - Chỉ số để tạo email duy nhất.
 * @returns {object} - Đối tượng chứa thông tin ứng viên giả định.
 * Created By LHDuy - 13/10/2025
 */
const generateCandidateData = (index) => {
    const firstName = getRandomElement(firstNames);
    const middleName = getRandomElement(middleNames);
    const lastName = getRandomElement(lastNames);
    const fullName = `${firstName} ${middleName} ${lastName}`;
    const emailPrefix = fullName.toLowerCase().replace(/\s/g, '').normalize("NFD").replace(/\p{M}/gu, "");

    return {
        CountTask: null, 
        CandidateName: fullName,
        Mobile: `0${Math.floor(Math.random() * 900000000) + 100000000}`,
        Email: `${emailPrefix}${index}@example.com`,
        RecruitmentCampaignNames: getRandomElement(recruitmentCampaigns),
        JobPositionName: getRandomElement(jobPositions),
        RecruitmentName: getRandomElement(recruitmentNames),
        RecruitmentRoundName: getRandomElement(recruitmentRounds),
        Score: Math.floor(Math.random() * 5) + 1,
        ApplyDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        ChannelName: null,
        EducationDegreeName: null,
        EducationPlaceName: null,
        EducationMajorName: null,
        WorkPlaceRecent: null,
        AttractivePersonnel: null,
        OrganizationUnitName: null,
        Overall: null,
        AreaName: null,
        PresenterName: null,
        ProbationInfoStatus: null,
        IsTalentPoolDetail: null,
        AccountPortal: null,
        TagInfos: null,
        CandidateStatusID: null,
        Gender: null,
        Birthday: null,
        Address: null,
        ReasonRemoved: null,
        CollaboratorName: null,
        HireDate: null,
        OfferStatus: null,
        RecruitmentChannelID: null,
        CandidateID: Math.floor(100000 + Math.random() * 900000),
        RecruitmentID: null,
        Avatar: null,
        AvatarColor: null,
        Active: null,
        CandidateStatusName: null,
        IsNew: null,
        IsSelfUpdate: null,
        IsNewProbationInfo: null,
        IsSentProbationInfo: null,
        RecruitmentStatusReal: null,
        RecruitmentStatus: null,
        IsOutOfCapcity: null,
        BirthdayFormat: null,
        MonthOfBirthday: null,
        YearOfBirthday: null,
        IsMultiNews: null,
        IsEmployee: null,
        CustomInforFields: null,
        PresenterOUID: null,
        PresenterOUName: null,
        CandidateType: null,
        UnreadEmailQuantity: null,
        EmployeeBlackListIDs: null,
        RecruitmentCampaignIDs: null,
        CandidateConvertID: null,
        SentPropose: null,
        UnreadCommentQuantity: null,
        StatusTrain: null,
        IsSendTrain: null,
        ProposeOfferStatus: null,
        IsDuplicate: null,
    };
};

const generatedCandidates = Array.from({ length: 10 }, (_, i) => generateCandidateData(i));
const combinedCandidateData = [originalCandidate, ...generatedCandidates];

// Load candidateData from localStorage if it exists, otherwise initialize it with default data
const storedCandidateData = localStorage.getItem('candidateData');
let candidateList = storedCandidateData ? JSON.parse(storedCandidateData) : combinedCandidateData;

// Save the initial or loaded candidateList to localStorage (important for first-time load if combinedCandidateData is used)
localStorage.setItem('candidateData', JSON.stringify(candidateList));
