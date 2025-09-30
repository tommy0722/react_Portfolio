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
            const [data, error] = await performRequest(`https://myweb-backend-571409330129.asia-east1.run.app/api/roulette/eatlogs/customer-food-count/${id}/`);
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

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                    color: '#2c3e50',
                    padding: 20
                }
            },
            title: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 15,
                cornerRadius: 10,
                titleFont: {
                    size: 16,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 14
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    color: '#2c3e50',
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#2c3e50',
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                }
            }
        }
    };

    return (
        <div className="main-container">
            <div className="chart-page-header">
                <h1 className="main-title">📊 統計報表</h1>
                <h2 className="group-name">
                    {chartData.datasets[0]?.label || '載入中...'}
                </h2>
            </div>
            <div className="chart-card">
                <div className="chart-wrapper">
                    <Chart type='bar' data={chartData} options={chartOptions} />
                </div>
            </div>
            <div className="chart-footer">
                <button className="btn-back" onClick={() => window.history.back()}>
                    ← 返回列表
                </button>
            </div>
        </div>
    );
}

export default ChartBar;
