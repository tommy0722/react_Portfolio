import React, { useEffect, useState } from 'react';
import './MapleBoss.css';
import axios from '../utils/axiosInstance';

function MapleBoss() {
    const [now, setNow] = useState(new Date());
    const [records, setRecords] = useState([]);

    useEffect(() => {
        fetchRecords();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);


    function fetchRecords() {
        axios.get('/maple/kill-records/').then(res => setRecords(res.data));
    }

    function formatTime(ms) {
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    function getCountdownRange(record) {
        if (!record?.kill_time) return '-';
        const killTime = new Date(record.kill_time);
        const min = new Date(killTime.getTime() + record.boss.respawn_min_minutes * 60000);
        const max = new Date(killTime.getTime() + record.boss.respawn_max_minutes * 60000);
        return `${formatTime(min - now)} ~ ${formatTime(max - now)}`;
    }


    return (
        <div className="maple-boss-container">
            <h1>擊殺紀錄</h1>
            <table>
                <thead>
                    <tr>
                        <th>伺服器</th>
                        <th>BOSS</th>
                        <th>重生時間（最小）</th>
                        <th>重生時間（最大）</th>
                        <th>掉落物</th>
                        <th>重生倒數</th>
                        <th>上傳者</th>
                        {/* <th>操作</th> */}
                    </tr>
                </thead>
                <tbody>
                    {records.map(record => (
                        <tr key={record.id}>
                            <td>{record.server_id}</td>
                            <td>{record.boss.name}</td>
                            <td>{record.boss.respawn_min_minutes} 分</td>
                            <td>{record.boss.respawn_max_minutes} 分</td>
                            <td>{(record.loots || []).join(', ')}</td>
                            <td>{getCountdownRange(record)}</td>
                            <td>{record.uploader.first_name}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MapleBoss;