// HomePage.js

import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from '../../context/UserContext';
import performRequest from './api';

// API 基礎網址
const API_BASE_URL = 'https://myweb-backend-571409330129.asia-east1.run.app/api/roulette';

function HomePage() {
  const [allRoulettes, setAllRoulettes] = useState([]);
  const [myRoulettes, setMyRoulettes] = useState([]);
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();
  const { userEmail, userName, isAuthenticated } = useContext(UserContext);

  const goToRoulette = (id) => {
    navigate(`/roulette/roulette/${id}`);
  };

  // 載入所有輪盤
  useEffect(() => {
    const fetchAllRoulettes = async () => {
      const [data, error] = await performRequest(`${API_BASE_URL}/eatgroups/`);
      if (!error && data) {
        setAllRoulettes(data);
      } else {
        console.error("Error fetching all roulettes:", error);
      }
    };

    fetchAllRoulettes();
  }, [reload]);

  // 載入我的輪盤（只有登入時才執行）
  useEffect(() => {
    const fetchMyRoulettes = async () => {
      if (!isAuthenticated || !userEmail) {
        setMyRoulettes([]);
        return;
      }

      const [data, error] = await performRequest(`${API_BASE_URL}/eatgroups/?user_email=${userEmail}`);
      if (!error && data) {
        // 篩選出有 user 的輪盤
        setMyRoulettes(data.filter(item => item.user !== null));
      } else {
        console.error("Error fetching my roulettes:", error);
      }
    };

    fetchMyRoulettes();
  }, [reload, isAuthenticated, userEmail]);

  const handleUpdate = (id) => {
    navigate(`/roulette/update/${id}`);
  };
  const handleChartBar = (id) => {
    navigate(`/roulette/chartbar/${id}`);
  };
  const handleMap = () => {
    navigate(`/roulette/map`);
  };
  const handleRandom = () => {
    navigate(`/roulette/random`);
  };

  // 新增公共輪盤
  const addPublicGroup = async () => {
    const groupName = prompt("請輸入新的群組:");
    if (groupName) {
      const newGroupItem = {
        Customer: groupName,
      };

      const [, error] = await performRequest(`${API_BASE_URL}/eatgroups/`, 'POST', { body: newGroupItem });
      if (!error) {
        alert("新增  " + groupName + "  成功");
        setReload(!reload);
      } else {
        alert(error);
      }
    }
  };

  // 新增個人輪盤
  const addMyGroup = async () => {
    if (!isAuthenticated) {
      alert("請先登入才能創建個人輪盤！");
      navigate('/login');
      return;
    }

    const groupName = prompt("請輸入新的群組:");
    if (groupName) {
      const newGroupItem = {
        Customer: groupName,
        user_email: userEmail, // 綁定使用者
      };

      const [, error] = await performRequest(`${API_BASE_URL}/eatgroups/`, 'POST', { body: newGroupItem });
      if (!error) {
        alert("新增  " + groupName + "  成功");
        setReload(!reload);
      } else {
        alert(error);
      }
    }
  };

  return (
    <div className="main-container">
      <h1 className="main-title">🍽️ 今天吃甚麼</h1>

      {/* 所有輪盤區塊 */}
      <div className="card-custom">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="section-title mb-0">🌍 所有輪盤</h3>
          <button className="btn-warning-custom" onClick={addPublicGroup}>
            ✨ 新增公共輪盤
          </button>
        </div>

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
            {allRoulettes.length > 0 ? (
              allRoulettes.map((item) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  目前沒有任何輪盤，點擊上方按鈕新增一個吧！
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 我的輪盤區塊 */}
      <div className="card-custom">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="section-title mb-0">👤 我的輪盤</h3>
          <button className="btn-warning-custom" onClick={addMyGroup}>
            ✨ 新增個人輪盤
          </button>
        </div>

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
            {!isAuthenticated ? (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  <p className="mb-2">請先登入以查看您的個人輪盤</p>
                  <button className="btn btn-primary" onClick={() => navigate('/login')}>
                    前往登入
                  </button>
                </td>
              </tr>
            ) : myRoulettes.length > 0 ? (
              myRoulettes.map((item) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  您還沒有個人輪盤，點擊上方按鈕創建一個吧！
                </td>
              </tr>
            )}
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
