import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import performRequest from './api';
import './Roulette.css'

// API 基礎網址
const API_BASE_URL = 'https://myweb-backend-571409330129.asia-east1.run.app/api/roulette';

const Roulette = () => {
  const [wheel, setWheel] = useState(null);
  const [groupData, setGroupData] = useState(null); 
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const [data, error] = await performRequest(`${API_BASE_URL}/foods/?eatgroup_id=${id}&Sh=1`);
      console.log('Foods API Response:', data, 'Error:', error);

      if (!error && data && Array.isArray(data) && data.length > 0) {
        const segments = data.map((item, index) => ({
          'fillStyle': ['#6695d4', '#3274c9', '#6ebcd4'][index % 3],
          'text': item.Food,
        }));
        const newWheel = new window.Winwheel({
          'canvasId': 'canvas',
          'numSegments': data.length,
          'outerRadius': 150,
          'textFontSize': 12,
          'segments': segments,
          'animation': {
            'type': 'spinToStop',
            'duration': 5,
            'spins': 8,
            'callbackFinished': async (indicatedSegment) => {
              alert("你抽中了：" + indicatedSegment.text);
              // 假设你有一个变量customerName表示当前用户
              const customerName = data[0].Eatgroup_name;
              const foodName = indicatedSegment.text;

              const [, error] = await performRequest(
                `${API_BASE_URL}/eatlogs/`,
                'POST',
                { body: { Customer: customerName, Food: foodName } }
              );

              if (error) {
                console.error("Failed to save the winning food:", error);
              } else {
                console.log("Winning food saved successfully:", data);
                newWheel.rotationAngle = 0;
                newWheel.draw();
              }
            }
          }
        });
        setWheel(newWheel);
      }
    };

    fetchData();
  }, [id]); // 依赖项包括id，确保id变化时重新获取数据
  useEffect(() => {
    const fetchGroupData = async () => {
      const [data, error] = await performRequest(`${API_BASE_URL}/foods/?eatgroup_id=${id}`);
      console.log('Group Foods Response:', data, 'Error:', error);
      if (!error) {
        setGroupData(data); // 更新状态
      } else {
        console.error("Failed to fetch group data:", error);
      }
    };

    fetchGroupData(); // 调用函数来执行异步请求
  }, [id]); // 当id变化时重新执行

  const startSpin = () => {
    wheel?.startAnimation();

  };

  // const Group = async () => {
  //   const [data, error] = await performRequest(`https://myweb-backend-571409330129.asia-east1.run.app/api/eatgroups/?id=${id}`);
  //   return data
  // }

  return (
    <div className="roulette-container">
      <h1 className="roulette-title">
        🎯{" "}
        {groupData && Array.isArray(groupData) && groupData.length > 0 ? (
          <span>{groupData[0].Eatgroup_name} 美食輪盤</span>
        ) : (
          <span>載入中...</span>
        )}
      </h1>

      <div className="wheel-container">
        <canvas
          id="canvas"
          className="wheel-canvas"
          onClick={startSpin}
          width="300"
          height="300"
        >
          您的瀏覽器不支援 Canvas，請使用其他瀏覽器。
        </canvas>

        <button className="spin-button" onClick={startSpin}>
          🎲 轉動輪盤
        </button>

        <p className="text-muted">點擊輪盤或按鈕開始轉動！</p>
      </div>

      {groupData && Array.isArray(groupData) && groupData.length > 0 && (
        <div className="food-list">
          <h3>🍽️ 美食選項</h3>
          <div className="food-items">
            {groupData.map((item, index) => (
              <span key={index} className="food-item">
                {item.Food}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        className="back-button"
        onClick={() => window.history.back()}
      >
        ← 返回上頁
      </button>
    </div>
  );
};

export default Roulette;
