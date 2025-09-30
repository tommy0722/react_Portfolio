import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Switch from "./Switch"; 
import performRequest from './api';
function UpdatePage() {
  const [foodData, setFoodData] = useState([]);
  const [reload, setReload] = useState(false);
  const { id } = useParams(); // 使用useParams获取URL参数
  const navigate = useNavigate(); // 用于导航
  useEffect(() => {
    const getData = async () => {
        const [data, error] = await performRequest(`https://myweb-backend-571409330129.asia-east1.run.app/api/roulette/foods/?eatgroup_id=${id}`);
        if (error) {
          console.error("Failed to fetch food data:", error);
        } else {
          setFoodData(data);
        }
      };
      getData();
    }, [reload]);
  const addFoodItem = async () => {
    const foodName = prompt("請輸入新的店家:");
    if (foodName) {
      const newFoodItem = {
        Food: foodName,
        Sh: 1, 
        Eatgroup: id, 
      };
      const [, error] = await performRequest('https://myweb-backend-571409330129.asia-east1.run.app/api/roulette/foods/', 'POST', { body: newFoodItem });
      if (!error) {
        alert("新增  "+foodName+"  成功");
        setReload(!reload);
      } else {
        alert(error)
        // performRequest内部已经处理了错误提示
      }
    }
  };
  
  const toggleSh = (index) => {
    const newData = [...foodData];
    newData[index].Sh = newData[index].Sh === 1 ? 0 : 1;
    setFoodData(newData);
  };

  const handleSave = async (event) => {
    event.preventDefault();  
    const [data, error] = await performRequest('https://myweb-backend-571409330129.asia-east1.run.app/api/roulette/foods/batch_update/', 'PUT', { body: foodData });
  
    if (error) {
      console.error("Failed to save data:", error);
    } else {
      console.log("Data saved successfully:", data);
      navigate("/"); // 跳转到HomePage
    }
  };

  return (
    <div className="main-container">
      <div className="update-page-header">
        <h1 className="main-title">
          ✏️ 編輯群組
        </h1>
        <h2 className="group-name">
          {foodData.length > 0 ? foodData[0].Eatgroup_name : '載入中...'}
        </h2>
      </div>

      <div className="update-actions">
        <button className="btn-warning-custom" onClick={addFoodItem}>
          ➕ 新增選項
        </button>
      </div>

      <table className="table-custom update-table">
        <thead>
          <tr>
            <th>🍽️ 項目名稱</th>
            <th style={{ width: '150px' }}>🎯 顯示狀態</th>
          </tr>
        </thead>
        <tbody>
          {foodData.map((item, index) => (
            <tr key={item.id}>
              <td className="food-name">{item.Food}</td>
              <td>
                <Switch
                  key={item.id}
                  isActive={item.Sh === 1}
                  toggle={() => toggleSh(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="update-footer">
        <button className="btn-save" onClick={handleSave}>
          💾 保存更改
        </button>
        <button className="btn-back" onClick={() => navigate('/roulette')}>
          ← 返回列表
        </button>
      </div>
    </div>
  );
}

export default UpdatePage;
