async function getUserIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Không thể lấy IP:', error);
      return null;
    }
  }
  
  async function registerUser() {
    return;
    const ip = await getUserIP();
    const userCode = generateUserCode();
    const registrationData = {
      userId: ip || Math.random().toString(36).substring(2),
      code: userCode,
      timestamp: new Date().toISOString()
    };
  
    try {
      const response = await fetch('YOUR_SERVER_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
      });
  
      if (response.ok) {
        console.log('Đăng ký người dùng thành công');
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
    }
  }
  
  function generateUserCode() {
    return 'USER-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  
  chrome.runtime.onInstalled.addListener(() => {
    registerUser();
  });