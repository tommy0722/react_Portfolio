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
  

//  CRUD範例
// // 创建一个新资源
// const createResource = async (resourceData) => {
//   const [data, error] = await performRequest('http://localhost:8000/api/resources/', 'POST', { body: resourceData });
//   if (error) {
//     console.error("Failed to create resource:", error);
//   } else {
//     console.log("Resource created successfully:", data);
//   }
// };

// // 读取资源
// const fetchResources = async () => {
//   const [data, error] = await performRequest('http://localhost:8000/api/resources/');
//   if (error) {
//     console.error("Failed to fetch resources:", error);
//   } else {
//     console.log("Resources fetched successfully:", data);
//   }
// };

// // 更新资源
// const updateResource = async (id, resourceData) => {
//   const [data, error] = await performRequest(`http://localhost:8000/api/resources/${id}/`, 'PUT', { body: resourceData });
//   if (error) {
//     console.error("Failed to update resource:", error);
//   } else {
//     console.log("Resource updated successfully:", data);
//   }
// };

// // 删除资源
// const deleteResource = async (id) => {
//   const [data, error] = await performRequest(`http://localhost:8000/api/resources/${id}/`, 'DELETE');
//   if (error) {
//     console.error("Failed to delete resource:", error);
//   } else {
//     console.log("Resource deleted successfully");
//   }
// };
