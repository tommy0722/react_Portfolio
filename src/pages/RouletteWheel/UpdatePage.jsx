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
    <div>
        <h1>{foodData.length > 0 ? foodData[0].Eatgroup_name : '網頁加載中...'}</h1>
    
      <table className="table  table-hover" style={{width:'80%'}}>
        <thead>
          <tr>
            <th>食物</th>
            <th style={{ width: '120px' }}>開關</th>
          </tr>
        </thead>
        <tbody>
          {foodData.map((item, index) => (
            <tr key={item.id}>
              <td>{item.Food}</td>
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
      <div className="row">
        <div className="col-2"></div>
      <button className="col-4 btn btn-outline-success" type="button" onClick={handleSave}>保存</button>
        <div className="col-2"></div>
      <button className="col-4 btn btn-outline-primary" onClick={addFoodItem}>新增新食物</button>
        <div className="col-2"></div>
      </div>
    </div>
  );
}

export default UpdatePage;
