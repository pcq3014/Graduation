/**
 * CẤU HÌNH TRẢI NGHIỆM THIỆP MỜI TỐT NGHIỆP CAO CẤP
 * Dành riêng cho: LÊ THỊ THANH - KHÓA 16 - LUẬT KINH TẾ - ĐẠI HỌC PHENIKAA
 * Toàn bộ thông tin được quản lý tập trung tại đây.
 */

export const graduationConfig = {
  // Thông tin cử nhân
  graduate: {
    fullName: "Lê Thị Thanh",
    firstName: "Thanh",
    title: "Tân Cử nhân",
    degree: "Cử nhân Luật Kinh tế",
    majorVi: "Luật Kinh tế",
    majorEn: "Economic Law",
    cohortVi: "Khóa 16",
    cohortCode: "K16",
    academicYears: "2023 — 2027",
    universityVi: "Trường Đại học Phenikaa",
    universityEn: "Phenikaa University",
    universityShort: "Phenikaa"
  },

  // Thời gian & Sự kiện
  event: {
    dateDisplay: "20.01.2027",
    dateFormattedVi: "Thứ Tư, ngày 20 tháng 01 năm 2027",
    dateFormattedEn: "Wednesday, January 20, 2027",
    day: "20",
    month: "January",
    monthNum: "01",
    year: "2027",
    timeDisplay: "08:00 — 11:30",
    isoDateTime: "2027-01-20T08:00:00+07:00", // Thời điểm bắt đầu countdown
    ceremonyPart: "Lễ Trao Bằng Tốt Nghiệp Đại Học",
    photoSession: "09:30 — 11:30 (Chụp ảnh kỷ niệm tại Quảng trường & Giảng đường)",
    location: {
      hall: "Hội trường A9-A10",
      venue: "Trường Đại học Phenikaa",
      address: "Đường Tố Hữu, P. Yên Nghĩa, Q. Hà Đông, TP. Hà Nội",
      googleMapsUrl: "https://maps.app.goo.gl/v27J6cSgzDesR6of7"
    }
  },

  // Nghệ thuật ngôn từ & Concept
  concept: {
    theme: "Her Chapter Begins",
    taglineVi: "Một chương khép lại. Một hành trình mới bắt đầu.",
    taglineEn: "The end of one chapter. The beginning of another.",
    coverHeadline: "GRADUATION 2027",
    reflectionQuote: "Bốn năm đại học tại Trường Đại học Phenikaa không chỉ là hành trình tích lũy tri thức pháp lý và kinh tế, mà còn là quá trình tôi luyện bản lĩnh, tìm thấy niềm tin và khẳng định giá trị bản thân.",
    invitationLetterVi: "Trân trọng kính mời những người thương yêu, thầy cô và bạn bè đã luôn đồng hành, sẻ chia và tiếp sức cùng Thanh trong suốt 4 năm đại học đến chung vui trong ngày lễ tốt nghiệp trọng đại này.",
    invitationLetterEn: "With immense gratitude and joy, you are cordially invited to celebrate this milestone alongside Le Thi Thanh as she enters a promising new horizon."
  },

  // Hành trình 4 năm đại học (The Journey 2023 - 2027)
  journey: [
    {
      chapter: "I",
      year: "2023",
      title: "The First Step",
      titleVi: "Khởi Đầu Mới",
      description: "Bước chân đầu tiên vào giảng đường Đại học Phenikaa với bao hoài bão, tò mò và khát khao chinh phục tri thức ngành Luật Kinh tế."
    },
    {
      chapter: "II",
      year: "2024",
      title: "Sharpening The Mind",
      titleVi: "Rèn Giũa Tư Duy",
      description: "Hòa mình vào thế giới của điều luật, án lệ, những buổi tranh biện sôi nổi và trau dồi nhãn quan kinh tế sâu sắc."
    },
    {
      chapter: "III",
      year: "2025",
      title: "Resilience & Growth",
      titleVi: "Bản Lĩnh & Trưởng Thành",
      description: "Những phiên tòa giả định căng thẳng, các kỳ thực tập thực tế cùng tình bạn gắn kết dưới tán cây xanh Phenikaa."
    },
    {
      chapter: "IV",
      year: "2026 — 2027",
      title: "The Triumph",
      titleVi: "Mùa Tốt Nghiệp",
      description: "Khép lại 4 năm trọn vẹn với tấm bằng Cử nhân danh giá, sẵn sàng tự tin bước sang chương mới của cuộc đời."
    }
  ],

  // Gallery hình ảnh nghệ thuật (Editorial Keepsake)
  gallery: [
    {
      id: "mem-1",
      src: "/images/hero_portrait.jpg",
      title: "The Poise & Grace",
      subtitle: "Thanh lịch và tự tin",
      tag: "Portrait 01",
      aspect: "portrait"
    },
    {
      id: "mem-2",
      src: "/images/gown_portrait.jpg",
      title: "Academic Regalia",
      subtitle: "Dấu ấn cử nhân tại giảng đường Phenikaa",
      tag: "Graduation 2027",
      aspect: "tall"
    },
    {
      id: "mem-3",
      src: "/images/study_portrait.jpg",
      title: "Quiet Dedication",
      subtitle: "Những giờ phút miệt mài bên trang sách luật",
      tag: "Memories",
      aspect: "portrait"
    },
    {
      id: "mem-4",
      src: "/images/celebration_portrait.jpg",
      title: "The Sunlit Smile",
      subtitle: "Nụ cười rạng rỡ của tuổi thanh xuân",
      tag: "Campus Life",
      aspect: "landscape"
    }
  ],

  // Thông tin liên lạc & mạng xã hội (tùy chọn)
  meta: {
    title: "Lê Thị Thanh — Graduation Invitation 2027 | Phenikaa University",
    description: "Trải nghiệm thiệp mời tốt nghiệp cao cấp dành riêng cho Lê Thị Thanh — Khóa 16, Ngành Luật Kinh tế, Trường Đại học Phenikaa.",
    ogImage: "/images/hero_portrait.jpg"
  }
};
