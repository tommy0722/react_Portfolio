import React, { useEffect, useState } from 'react';
import './SummaryPage.css';
import axios from '../../services/axiosInstance';

function KillSummaryPage() {
    const [summary, setSummary] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchKillSummary();
    }, [filter]);

    function fetchKillSummary() {
        const url = filter === 'today' ? 'maple/kill-summary/?today=true' : 'maple/kill-summary/';
        axios.get(url).then(res => setSummary(res.data));
    }

    return (
        <div className="summary-container">
            <h1 className="summary-title">擊殺統計</h1>

            <div className="summary-filter">
                <button
                    className={`summary-filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    所有
                </button>
                <button
                    className={`summary-filter-btn ${filter === 'today' ? 'active' : ''}`}
                    onClick={() => setFilter('today')}
                >
                    今天
                </button>
            </div>

            <table className="summary-table">
                <thead>
                    <tr>
                        <th>使用者</th>
                        <th>BOSS</th>
                        <th>擊殺次數</th>
                        <th>掉落物</th>
                    </tr>
                </thead>
                <tbody>
                    {summary.map((item, idx) => (
                        <tr key={idx}>
                            <td>{item.uploader_name}</td>
                            <td>{item.boss_name}</td>
                            <td>{item.kill_count}</td>
                            <td>{(item.loots || []).join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default KillSummaryPage;
