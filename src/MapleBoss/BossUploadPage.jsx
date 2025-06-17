import React, { useEffect, useState } from 'react';
import './MapleBoss.css';
import Select from 'react-select';
import axios from '../utils/axiosInstance';

function MapleBoss() {
    const [now, setNow] = useState(new Date());
    const [serverId, setServerId] = useState('');
    const [bosses, setBosses] = useState([]);
    const [selectedBoss, setSelectedBoss] = useState('');
    const [selectedDrops, setSelectedDrops] = useState([]);
    const [records, setRecords] = useState([]);

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
        const killTime = new Date(record.kill_time);
        const min = new Date(killTime.getTime() + record.boss.respawn_min_minutes * 60000);
        const max = new Date(killTime.getTime() + record.boss.respawn_max_minutes * 60000);
        return `${formatTime(min - now)} ~ ${formatTime(max - now)}`;
    }
    function getRespawnStatus(record) {
        if (!record?.kill_time) return 'unknown';

        const nowMs = now.getTime();
        const killTime = new Date(record.kill_time);
        const min = killTime.getTime() + record.boss.respawn_min_minutes * 60000;
        const max = killTime.getTime() + record.boss.respawn_max_minutes * 60000;

        if (nowMs < min) return 'waiting';         // 尚未進入重生期
        if (nowMs <= max) return 'respawning';     // 正在重生期範圍
        return 'overdue';                          // 已經超過最大時間
    }

    function handleSubmit(e) {
        e.preventDefault();
        const payload = {
            server_id: parseInt(serverId),
            boss: parseInt(selectedBoss),
            loots: selectedDrops,
        };
        axios.post('/maple/kill-records/', payload).then(res => {
            alert('上傳成功');
            setServerId('');
            setSelectedBoss('');
            setSelectedDrops([]);
            fetchRecords();
        }).catch(() => alert('發生錯誤'));
    }

    function handleDelete(id) {
        if (!window.confirm('確定要刪除此筆紀錄嗎？')) return;
        axios.delete(`/maple/kill-records/${id}/`).then(() => {
            alert('刪除成功');
            fetchRecords();
        }).catch(() => alert('刪除失敗'));
    }

    function handleRefresh(id) {
        axios.post(`/maple/kill-records/${id}/refresh/`).then(() => {
            alert('時間已更新');
            fetchRecords();
        }).catch(() => alert('更新失敗'));
    }


    return (
        <div className="maple-boss-container">
            <h1>楓之谷 BOSS 紀錄上傳</h1>

            <form onSubmit={handleSubmit} className="boss-form-inline">
                <input
                    type="number"
                    value={serverId}
                    onChange={e => setServerId(e.target.value)}
                    placeholder="伺服器 ID"
                    required
                    className="form-control form-control-sm"
                    style={{ width: '120px' }}
                />

                <select
                    value={selectedBoss}
                    onChange={e => setSelectedBoss(e.target.value)}
                    required
                    className="form-select form-select-sm"
                    style={{ width: '160px' }}
                >
                    <option value="">選擇 BOSS</option>
                    {bosses.map(boss => (
                        <option key={boss.id} value={boss.id}>{boss.name}</option>
                    ))}
                </select>

                <div style={{ minWidth: '250px', flexGrow: 1 }}>
                    <Select
                        isMulti
                        options={(bosses.find(b => b.id === parseInt(selectedBoss))?.drop_items || []).map(item => ({
                            value: item.name,
                            label: item.name,
                        }))}
                        value={selectedDrops.map(name => ({ value: name, label: name }))}
                        onChange={selected => setSelectedDrops(selected.map(opt => opt.value))}
                        placeholder="搜尋或選擇掉落物"
                        theme={theme => ({
                            ...theme,
                            borderRadius: 4,
                            colors: {
                                ...theme.colors,
                                primary25: '#b2e4f7',
                                primary: '#0d6efd',
                                neutral0: '#ffffff',
                                neutral80: '#000000',
                            },
                        })}
                        styles={{
                            control: base => ({ ...base, backgroundColor: 'white', color: 'black' }),
                            input: base => ({ ...base, color: 'black' }),
                            multiValueLabel: base => ({ ...base, color: 'black' }),
                            singleValue: base => ({ ...base, color: 'black' }),
                            option: base => ({ ...base, color: 'black' }),
                        }}
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-sm">送出</button>
            </form>

            <h2>擊殺紀錄</h2>
            <table className="table-primary table-bordered table-sm text-center" style={{ color: 'white' }}>
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
                    {records.map(record => {
                        const countdown = getCountdownRange(record);
                        const respawnStatus = getRespawnStatus(record);
                        const countdownClass = {
                            waiting: '', // 尚未重生，不強調
                            respawning: 'text-danger bg-warning-subtle fw-bold', // 進入可打期
                            overdue: 'text-white bg-danger fw-bold', // 已超過最大重生時間
                        }[respawnStatus];
                        return (
                            <tr key={record.id}>
                                <td>{record.server_id}</td>
                                <td>{record.boss.name}</td>
                                <td>{record.boss.respawn_min_minutes} 分</td>
                                <td>{record.boss.respawn_max_minutes} 分</td>
                                <td>{(record.loots || []).join(', ')}</td>
                                <td className={countdownClass}>
                                    {countdown}
                                </td>
                                <td>{record.uploader.first_name}</td>
                                {/* <td>
                                <button
                                    className="btn btn-danger btn-sm me-2"
                                    onClick={() => handleDelete(record.id)}
                                >刪除</button>
                                <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() => handleRefresh(record.id)}
                                >更新時間</button>
                            </td> */}
                            </tr>
                        );
                    })}
                </tbody>

            </table>
        </div>
    );
}

export default MapleBoss;