import React, { useState, useEffect, useCallback } from "react"; // 引入 useCallback
import { useParams } from "react-router-dom";
import { Chart } from 'react-chartjs-2';
import performRequest from '../api';
import './ChartBar.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,BarController   } from 'chart.js';

// ChartJS 全局注册
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    BarController 
);

function ChartBar() {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
          label: '',
          data: [],
          backgroundColor: [],
          hoverBackgroundColor: []
        }]
    });
    const { id } = useParams(); // 使用 useParams 钩子获取路由参数

    // 使用 useCallback 包装 loadChartData，依赖于 id
    const loadChartData = useCallback(async () => {
        try {
            const [data, error] = await performRequest(`https://myweb-backend-571409330129.asia-east1.run.app/api/roulette/eatlogs/customer-food-count/${id}`);
            if (error) {
                console.error("Failed to fetch food data:", error);
            } else {
                if (data) { // 添加数据存在性检查
                    console.log(data);
                    const labels = data.food_count?.map(item => item.Food);
                    const totalFoodData = data.food_count.map(item => item.total_food);

                    setChartData({
                        labels: labels,
                        datasets: [
                            {
                                label: data.customer.name,
                                backgroundColor: "rgba(154,178,96,0.5)",
                                hoverBackgroundColor: "rgba(154,178,96,1)",
                                data: totalFoodData,
                            }
                        ]
                    });
                } else {
                    console.error("Data is invalid or empty:", data);
                }
            }
        } catch (error) {
            console.error("Error fetching food data:", error);
        }
    }, [id]); // id 作为依赖，保证当 id 变化时重新调用

    // 使用 useEffect 来调用 loadChartData，依赖项为 loadChartData 函数本身
    useEffect(() => {
        loadChartData();
    }, [loadChartData]);

    return (
        <div>
            <h2>統計圖表</h2>
            <div className="chart-container">
                <Chart type='bar' data={chartData} options={{}} />
            </div>
        </div>
    );
}

export default ChartBar;
