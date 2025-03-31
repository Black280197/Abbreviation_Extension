// Danh sách từ viết tắt mặc định
const defaultAbbreviations = {
    "cc": "Căn cước công dân",
    "cmnd": "Chứng minh nhân dân",
    "dc": "Địa chỉ"
  };
  
  let abbreviations = defaultAbbreviations;
  
  // Load các thiết lập từ storage
  chrome.storage.sync.get(['abbreviations'], (result) => {
    if (result.abbreviations) {
      abbreviations = result.abbreviations;
    }
  });
  
  // Xử lý sự kiện change trên input
  document.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT') {
      const value = e.target.value.trim();
      if (abbreviations[value]) {
        e.target.value = abbreviations[value];
      }
    }
  });

  // Xử lý sự kiện change trên textarea
  document.addEventListener('input', (e) => {
    if (e.target.tagName === 'TEXTAREA') {
      const value = e.target.value.trim();
      if (abbreviations[value]) {
        e.target.value = abbreviations[value];
      }
    }
  });
  
  // Kiểm tra thời gian sử dụng
  function checkTimeValidity() {
    return true;
    const startTime = new Date('2025-03-31T08:00:00');
    const endTime = new Date('2025-03-31T10:00:00');
    const now = new Date();
  
    if (now < startTime || now > endTime) {
      console.log('Extension không hoạt động ngoài khung giờ cho phép');
      return false;
    }
    return true;
  }
  
  if (checkTimeValidity()) {
    console.log('Extension đang hoạt động');
  }