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
  
      // Thêm sự kiện cho các nút sửa và xóa
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
        
        // Xóa trước khi thêm lại khi người dùng nhấn "Thêm"
        document.getElementById('add').onclick = () => {
          const newShort = document.getElementById('short').value.trim();
          const newFull = document.getElementById('full').value.trim();
          if (newShort && newFull) {
            delete abbreviations[short]; // Xóa mục cũ
            abbreviations[newShort] = newFull; // Thêm mục mới
            chrome.storage.sync.set({ abbreviations }, () => {
              updateList();
              document.getElementById('short').value = '';
              document.getElementById('full').value = '';
              // Khôi phục sự kiện thêm mặc định
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
  
  // Lưu handler mặc định để khôi phục
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
  
  // Load danh sách khi mở options
  updateList();