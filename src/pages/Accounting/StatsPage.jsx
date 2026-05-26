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

    // 圓餅圖資料 — 依選定類型的分類小計
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
            }],
        };
    })();

    // 長條圖資料 — 近 6 個月收支
    const barData = {
        labels: trend.map(t => t.label),
        datasets: [
            {
                label: '收入',
                data: trend.map(t => t.income),
                backgroundColor: '#22c55e',
            },
            {
                label: '支出',
                data: trend.map(t => t.expense),
                backgroundColor: '#ef4444',
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } },
    };

    return (
        <div>
            {/* 圓餅圖 */}
            <div className="mb-5">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <h6 className="fw-bold mb-0">分類佔比（{month}）</h6>
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
                    <div style={{ maxWidth: 360, margin: '0 auto' }}>
                        <Pie data={pieData} />
                    </div>
                ) : (
                    <div className="text-center text-muted py-4">本月無{showType === 'expense' ? '支出' : '收入'}分類資料</div>
                )}
            </div>

            {/* 長條圖 */}
            <div>
                <h6 className="fw-bold mb-3">近 6 個月收支趨勢</h6>
                {loadingTrend ? (
                    <div className="text-center py-4">載入中...</div>
                ) : (
                    <Bar data={barData} options={barOptions} />
                )}
            </div>
        </div>
    );
}

export default StatsPage;
