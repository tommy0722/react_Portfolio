// HomePage.js

import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import performRequest from './api';
function HomePage() {
  const [eatGroupData, setEatGroupData] = useState([]);
  const [reload, setReload] = useState(false);
  const goToRoulette = (id) => {
    navigate(`/roulette/${id}`);
  };
  useEffect(() => {
    fetch("https://myweb-backend-571409330129.asia-east1.run.app/api/roulette/eatgroups/")
      .then((response) => response.json())
      .then((data) => setEatGroupData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [reload]);
  const handleUpdate = (id) => {
    navigate(`/update/${id}`);
  };
  const handleChartBar = (id) => {
    navigate(`/chartbar/${id}`);
  };
  const handleMap = () => {
    navigate(`/map`);
  };
  const handleRandom = () => {
    navigate(`/random`);
  };
  const navigate = useNavigate();

  const addGroupItem = async () => {
    const groupName = prompt("請輸入新的群組:");
    if (groupName) {
      const newGroupItem = {
        Customer: groupName,
      };
      const [, error] = await performRequest('https://myweb-backend-571409330129.asia-east1.run.app/api/roulette/eatgroups/', 'POST', { body: newGroupItem });
      if (!error) {
        alert("新增  " + groupName + "  成功");
        setReload(!reload); // 更新狀態以觸發 useEffect
      } else {
        alert(error);
      }
    }
  };

  return (
    <div className="main-container">
      <h1 className="main-title">🍽️ 今天吃甚麼</h1>

      {/* 自訂輪盤區塊 */}
      <div className="card-custom">
        <h3 className="section-title">🎯 自訂輪盤</h3>
        <button className="btn-warning-custom" onClick={addGroupItem}>
          ✨ 新增群組
        </button>

        <table className="table table-custom">
          <thead>
            <tr>
              <th>🏷️ 群組名稱</th>
              <th>⚙️ 管理</th>
              <th>🎮 遊戲</th>
              <th>📊 數據</th>
            </tr>
          </thead>
          <tbody>
            {eatGroupData.map((item) => (
              <tr key={item.id}>
                <td className="fw-bold">{item.Customer}</td>
                <td>
                  <button className="btn-custom" onClick={() => handleUpdate(item.id)}>
                    ✏️ 修改
                  </button>
                </td>
                <td>
                  <button className="btn-custom" onClick={() => goToRoulette(item.id)}>
                    🎲 進入輪盤
                  </button>
                </td>
                <td>
                  <button className="btn-custom" onClick={() => handleChartBar(item.id)}>
                    📈 查看報表
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Google Map 區塊 */}
      <div className="card-custom">
        <h3 className="section-title">🗺️ Google Map 尋找附近美食</h3>
        <p className="text-muted mb-4">探索附近的餐廳，讓美食來選擇你！</p>

        <table className="table table-custom">
          <thead>
            <tr>
              <th>🎯 遊戲模式</th>
              <th>🚀 開始遊戲</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div>
                  <strong>🎡 輪盤模式</strong>
                  <br />
                  <small className="text-muted">轉動命運之輪，讓輪盤決定你的美食</small>
                </div>
              </td>
              <td>
                <button className="btn-custom" onClick={() => handleMap(true)}>
                  🎯 開始輪盤
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <div>
                  <strong>🎲 隨機模式</strong>
                  <br />
                  <small className="text-muted">完全隨機選擇，給你意想不到的驚喜</small>
                </div>
              </td>
              <td>
                <button className="btn-custom" onClick={() => handleRandom(true)}>
                  🎲 隨機選擇
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default HomePage;
