document.getElementById('add').addEventListener('click', () => {
    const short = document.getElementById('short').value.trim();
    const full = document.getElementById('full').value.trim();
    
    if (short && full) {
      chrome.storage.sync.get(['abbreviations'], (result) => {
        const abbreviations = result.abbreviations || {};
        abbreviations[short] = full;
        
        chrome.storage.sync.set({ abbreviations }, () => {
          updateList();
          document.getElementById('short').value = '';
          document.getElementById('full').value = '';
        });
      });
    }
  });
  
  function updateList() {
    chrome.storage.sync.get(['abbreviations'], (result) => {
      const list = document.getElementById('list');
      list.innerHTML = '';
      const abbreviations = result.abbreviations || {};
      
      for (let short in abbreviations) {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${short} → ${abbreviations[short]}</span>
          <div class="actions">
            <button class="edit-btn" data-short="${short}">Sửa</button>
            <button class="delete-btn" data-short="${short}">Xóa</button>
          </div>
        `;
        list.appendChild(li);
      }
  
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const short = e.target.getAttribute('data-short');
          editAbbreviation(short);
        });
      });
  
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const short = e.target.getAttribute('data-short');
          deleteAbbreviation(short);
        });
      });
    });
  }
  
  function editAbbreviation(short) {
    chrome.storage.sync.get(['abbreviations'], (result) => {
      const abbreviations = result.abbreviations || {};
      if (abbreviations[short]) {
        document.getElementById('short').value = short;
        document.getElementById('full').value = abbreviations[short];
        
        document.getElementById('add').onclick = () => {
          const newShort = document.getElementById('short').value.trim();
          const newFull = document.getElementById('full').value.trim();
          if (newShort && newFull) {
            delete abbreviations[short];
            abbreviations[newShort] = newFull;
            chrome.storage.sync.set({ abbreviations }, () => {
              updateList();
              document.getElementById('short').value = '';
              document.getElementById('full').value = '';
              document.getElementById('add').onclick = null;
              document.getElementById('add').addEventListener('click', addHandler);
            });
          }
        };
      }
    });
  }
  
  function deleteAbbreviation(short) {
    chrome.storage.sync.get(['abbreviations'], (result) => {
      const abbreviations = result.abbreviations || {};
      if (abbreviations[short]) {
        delete abbreviations[short];
        chrome.storage.sync.set({ abbreviations }, () => {
          updateList();
        });
      }
    });
  }
  
  function addHandler() {
    const short = document.getElementById('short').value.trim();
    const full = document.getElementById('full').value.trim();
    
    if (short && full) {
      chrome.storage.sync.get(['abbreviations'], (result) => {
        const abbreviations = result.abbreviations || {};
        abbreviations[short] = full;
        
        chrome.storage.sync.set({ abbreviations }, () => {
          updateList();
          document.getElementById('short').value = '';
          document.getElementById('full').value = '';
        });
      });
    }
  }
  
  // Xử lý thu nhỏ và mở lại
  const minimizeBtn = document.getElementById('minimize-btn');
  const floatingIcon = document.getElementById('floating-icon');
  const mainContent = document.querySelector('body > *:not(#floating-icon)');
  
//   minimizeBtn.addEventListener('click', () => {
//     mainContent.style.display = 'none';
//     floatingIcon.style.display = 'block';
//     // Không đóng popup mà chỉ ẩn nội dung
//   });
  
  floatingIcon.addEventListener('click', () => {
    mainContent.style.display = 'block';
    floatingIcon.style.display = 'none';
  });
  
  // Load danh sách khi mở popup
  updateList();