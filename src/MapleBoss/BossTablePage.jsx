import React, { useEffect, useState } from 'react';
import './MapleBoss.css';
import axios from '../utils/axiosInstance';
import Select from 'react-select/base';

function MapleBoss() {
    const [now, setNow] = useState(new Date());
    const [records, setRecords] = useState([]);
    const [bosses, setBosses] = useState([]);
    const [selectedBossFilter, setSelectedBossFilter] = useState('');

    useEffect(() => {
        fetchBosses();
        fetchRecords();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    function fetchBosses() {
        axios.get('/maple/bosses/').then(res => setBosses(res.data));
    }
    function fetchRecords() {
        axios.get('/maple/kill-records/recent/').then(res => setRecords(res.data));
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
        const now = new Date();
        const killTime = new Date(record.kill_time);
        const min = new Date(killTime.getTime() + record.boss.respawn_min_minutes * 60000);
        const max = new Date(killTime.getTime() + record.boss.respawn_max_minutes * 60000);

        const diffMin = Math.max(0, Math.round((min - now) / 60000));
        const diffMax = Math.max(0, Math.round((max - now) / 60000));

        return `${diffMin} 分 ~ ${diffMax} 分`;
    }
    function formatTime(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}`;
    }

    return (
        <div className="maple-boss-container">
            <h1>擊殺紀錄</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <label style={{ whiteSpace: 'nowrap', marginBottom: 0 }}>搜尋自己的打王紀錄：</label>
                <select
                    className="form-select"
                    value={selectedBossFilter}
                    onChange={e => setSelectedBossFilter(e.target.value)}
                    style={{ maxWidth: '300px' }}
                >
                    <option value="">全部 BOSS</option>
                    {bosses.map(boss => (
                        <option key={boss.id} value={boss.name}>{boss.name}</option>
                    ))}
                </select>
            </div>

            <table className="table-primary table-bordered table-sm text-center" style={{ color: 'white' }}>
                <thead>
                    <tr>
                        <th>排序</th>
                        <th>BOSS</th>
                        {/* <th>重生時間（最小）</th>
                        <th>重生時間（最大）</th> */}
                        <th>掉落物</th>
                        {/* <th>重生倒數</th> */}
                        <th>上傳者</th>
                        <th>上傳時間</th>
                        {/* <th>操作</th> */}
                    </tr>
                </thead>
                <tbody>
                    {records
                        .filter(record =>
                            selectedBossFilter === '' || record.boss.name === selectedBossFilter
                        )
                        .map((record, index) => (
                            <tr key={record.id}>
                                <td>{index + 1}</td> {/* ← 排序從 1 開始 */}
                                <td>{record.boss.name}</td>
                                {/* <td>{record.boss.respawn_min_minutes} 分</td>
                            <td>{record.boss.respawn_max_minutes} 分</td> */}
                                <td>{(record.loots || []).join(', ')}</td>
                                {/* <td>{getCountdownRange(record)}</td> */}
                                <td>{record.uploader.first_name}</td>
                                <td>{formatTime(record.kill_time)}</td>

                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default MapleBoss;