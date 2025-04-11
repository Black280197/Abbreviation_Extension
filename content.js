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
        // e.target.value = abbreviations[value];
        // e.target.dataset.initialValue = abbreviations[value];
        simulatePaste(e.target, abbreviations[value]);
      }
    }
  });

  // Xử lý sự kiện change trên textarea
  document.addEventListener('input', (e) => {
    if (e.target.tagName === 'TEXTAREA') {
      const value = e.target.value.trim();
      if (abbreviations[value]) {
        // e.target.value = abbreviations[value];
        // e.target.dataset.initialValue = abbreviations[value];
        simulatePaste(e.target, abbreviations[value]);
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


  function simulatePaste(element, text) {
    // Kiểm tra xem element và text hợp lệ
    if (!element || !text || typeof text !== 'string') {
      console.error('Invalid element or text');
      return;
    }
  
    // Copy text vào clipboard
    navigator.clipboard.writeText(text).then(() => {
      // Focus vào element để đảm bảo paste hoạt động
      element.focus();
  
      // Giả lập sự kiện keydown cho Ctrl
      const keydownCtrl = new KeyboardEvent('keydown', {
        key: 'Control',
        code: 'ControlLeft',
        ctrlKey: true,
        bubbles: true,
        cancelable: true
      });
      element.dispatchEvent(keydownCtrl);
  
      // Giả lập sự kiện keydown cho phím V
      const keydownV = new KeyboardEvent('keydown', {
        key: 'v',
        code: 'KeyV',
        ctrlKey: true,
        bubbles: true,
        cancelable: true
      });
      element.dispatchEvent(keydownV);
  
      // Giả lập sự kiện paste
      const pasteEvent = new ClipboardEvent('paste', {
        clipboardData: new DataTransfer(),
        bubbles: true,
        cancelable: true
      });
      pasteEvent.clipboardData.setData('text/plain', text);
      element.dispatchEvent(pasteEvent);
  
      // Cập nhật giá trị của element
      element.value = text;
  
      // Giả lập sự kiện input
      const inputEvent = new InputEvent('input', {
        data: text,
        bubbles: true,
        cancelable: true
      });
      element.dispatchEvent(inputEvent);
  
      // Giả lập sự kiện keyup cho phím V
      const keyupV = new KeyboardEvent('keyup', {
        key: 'v',
        code: 'KeyV',
        ctrlKey: true,
        bubbles: true,
        cancelable: true
      });
      element.dispatchEvent(keyupV);
  
      // Giả lập sự kiện keyup cho Ctrl
      const keyupCtrl = new KeyboardEvent('keyup', {
        key: 'Control',
        code: 'ControlLeft',
        ctrlKey: false,
        bubbles: true,
        cancelable: true
      });
      element.dispatchEvent(keyupCtrl);
  
      // Giả lập sự kiện change
      const changeEvent = new Event('change', {
        bubbles: true,
        cancelable: true
      });
      element.dispatchEvent(changeEvent);
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
    });
  }