// api.js
const performRequest = async (url, method = 'GET', options = {}) => {
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          // 如果有认证令牌或其他默认头部信息，可以在这里添加
          ...options.headers,
        },
        body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(options.body) : null,
      });
  
      if (response.ok) {
        const data = await response.json();
        return [data, null]; // 成功时返回数据和错误为null
      } else {
        console.error("Server response:", response.statusText);
        return [null, response.statusText]; // 返回错误信息
      }
    } catch (error) {
      console.error("Error performing request:", error);
      return [null, error.message]; // 返回错误信息
    }
  };
  
  export default performRequest;
