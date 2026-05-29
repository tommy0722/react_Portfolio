import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js';
import { transactionAPI } from '../../services/accountingService';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const EXPENSE_COLORS = [
    '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e',
    '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e',
];

const WHITE = '#ffffff';
const WHITE_DIM = 'rgba(255,255,255,0.6)';

const chartTextStyle = {
    color: WHITE,
    font: { family: 'Poppins, sans-serif' },
};

const pieOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
            labels: { color: WHITE, padding: 16 },
        },
        tooltip: { bodyColor: WHITE, titleColor: WHITE },
    },
};

const barOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
            labels: { color: WHITE },
        },
        tooltip: { bodyColor: WHITE, titleColor: WHITE },
    },
    scales: {
        x: {
            ticks: { color: WHITE },
            grid: { color: 'rgba(255,255,255,0.1)' },
        },
        y: {
            beginAtZero: true,
            ticks: { color: WHITE },
            grid: { color: 'rgba(255,255,255,0.1)' },
        },
    },
};

function StatsPage({ summary, month }) {
    const [trend, setTrend] = useState([]);
    const [loadingTrend, setLoadingTrend] = useState(false);
    const [showType, setShowType] = useState('expense');

    useEffect(() => {
        setLoadingTrend(true);
        transactionAPI.monthlyTrend()
            .then(res => setTrend(res.data))
            .catch(() => setTrend([]))
            .finally(() => setLoadingTrend(false));
    }, []);

    const pieData = (() => {
        if (!summary?.by_category) return null;
        const rows = summary.by_category.filter(r => r.type === showType && r.category__name);
        if (rows.length === 0) return null;
        return {
            labels: rows.map(r => r.category__name),
            datasets: [{
                data: rows.map(r => r.total),
                backgroundColor: EXPENSE_COLORS.slice(0, rows.length),
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.2)',
            }],
        };
    })();

    const barData = {
        labels: trend.map(t => t.label),
        datasets: [
            { label: '收入', data: trend.map(t => t.income), backgroundColor: 'rgba(74,222,128,0.8)' },
            { label: '支出', data: trend.map(t => t.expense), backgroundColor: 'rgba(248,113,113,0.8)' },
        ],
    };

    return (
        <div>
            {/* 圓餅圖 */}
            <div className="mb-5">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <h6 className="fw-bold mb-0" style={{ color: WHITE }}>分類佔比（{month}）</h6>
                    <div className="btn-group btn-group-sm">
                        <button
                            className={`btn ${showType === 'expense' ? 'btn-danger' : 'btn-outline-danger'}`}
                            onClick={() => setShowType('expense')}
                        >支出</button>
                        <button
                            className={`btn ${showType === 'income' ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => setShowType('income')}
                        >收入</button>
                    </div>
                </div>
                {pieData ? (
                    <div style={{ maxWidth: 'min(360px, 100%)', margin: '0 auto' }}>
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                ) : (
                    <div className="text-center py-4" style={{ color: WHITE_DIM }}>
                        本月無{showType === 'expense' ? '支出' : '收入'}分類資料
                    </div>
                )}
            </div>

            {/* 長條圖 */}
            <div>
                <h6 className="fw-bold mb-3" style={{ color: WHITE }}>近 6 個月收支趨勢</h6>
                {loadingTrend ? (
                    <div className="text-center py-4" style={{ color: WHITE_DIM }}>載入中...</div>
                ) : (
                    <Bar data={barData} options={barOptions} />
                )}
            </div>
        </div>
    );
}

export default StatsPage;
