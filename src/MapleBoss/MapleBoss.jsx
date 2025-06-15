// src/MapleBoss/MapleBoss.jsx
import React, { useEffect, useState } from 'react';
import './MapleBoss.css';
import Select from 'react-select';



const MapleBoss = () => {
    const [now, setNow] = useState(new Date());
    const [serverId, setServerId] = useState('');
    const [bosses, setBosses] = useState([]);
    const [selectedBoss, setSelectedBoss] = useState('');
    const [selectedDrops, setSelectedDrops] = useState([]);
    const [records, setRecords] = useState([]);
    const token = localStorage.getItem('access');



    // 抓 Boss 名單
    useEffect(() => {
        fetch('https://myweb-backend-571409330129.asia-east1.run.app/api/maple/bosses/')
            .then(res => res.json())
            .then(data => setBosses(data));
    }, []);

    // 抓擊殺紀錄
    useEffect(() => {
        fetch('https://myweb-backend-571409330129.asia-east1.run.app/api/maple/kill-records/')
            .then(res => res.json())
            .then(data => {
                setRecords(data);
            });
    }, []);
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000); // ✅ 加這段
        return () => clearInterval(timer);
    }, []);

    const formatTime = (ms) => {
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };




    // 表單送出
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('token:', token);
        const payload = {
            server_id: parseInt(serverId),
            boss: parseInt(selectedBoss),
            loots: selectedDrops,
        };
        fetch('https://myweb-backend-571409330129.asia-east1.run.app/api/maple/kill-records/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        })
            .then(res => {
                if (res.ok) {
                    alert('上傳成功');
                    setServerId('');
                    setSelectedBoss('');
                    setSelectedDrops([]);
                    fetchRecords();
                } else {
                    alert('發生錯誤');
                }
            });
    };

    const handleDelete = (id) => {
        const token = localStorage.getItem('access');
        if (!window.confirm('確定要刪除此筆紀錄嗎？')) return;

        fetch(`https://myweb-backend-571409330129.asia-east1.run.app/api/maple/kill-records/${id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(res => {
                if (res.ok) {
                    alert('刪除成功');
                    // 刪除成功後重新抓資料
                    fetchRecords();
                } else {
                    alert('刪除失敗');
                }
            });
    };

    const handleRefresh = (id) => {
        const token = localStorage.getItem('access');
        fetch(`https://myweb-backend-571409330129.asia-east1.run.app/api/maple/kill-records/${id}/refresh/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(res => {
                if (res.ok) {
                    alert('時間已更新');
                    fetchRecords(); // 重新載入資料
                } else {
                    alert('更新失敗');
                }
            });
    };

    const getCountdownRange = (record, now) => {
        if (!record?.kill_time) return '-';

        const killTime = new Date(record.kill_time);
        const min = new Date(killTime.getTime() + record.boss.respawn_min_minutes * 60 * 1000);
        const max = new Date(killTime.getTime() + record.boss.respawn_max_minutes * 60 * 1000);
        const minLeft = min - now;
        const maxLeft = max - now;

        return `${formatTime(minLeft)} ~ ${formatTime(maxLeft)}`;
    };

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
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 4,
                            colors: {
                                ...theme.colors,
                                primary25: '#b2e4f7',   // hover 背景
                                primary: '#0d6efd',     // focus 邊框
                                neutral0: '#ffffff',    // 控制背景色
                                neutral80: '#000000',   // 控制文字色（但不一定每個元素都吃這個）
                            },
                        })}
                        styles={{
                            control: (base) => ({
                                ...base,
                                backgroundColor: 'white',
                                color: 'black',
                            }),
                            input: (base) => ({
                                ...base,
                                color: 'black',
                            }),
                            multiValueLabel: (base) => ({
                                ...base,
                                color: 'black',
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: 'black',
                            }),
                            option: (base) => ({
                                ...base,
                                color: 'black',
                            }),
                        }}
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-sm">
                    送出
                </button>
            </form>


            <h2>擊殺紀錄</h2>
            <table>
                <thead>
                    <tr>
                        <th>伺服器</th>
                        <th>BOSS</th>
                        <th>重生時間（最小）</th>
                        <th>重生時間（最大）</th>
                        <th>掉落物</th>
                        <th>重生時間</th>
                        <th>操作</th>
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
                            <td>{getCountdownRange(record, now)}</td>
                            <td>
                                <button
                                    className="btn btn-danger btn-sm me-2"
                                    onClick={() => handleDelete(record.id)}
                                >
                                    刪除
                                </button>

                                <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() => handleRefresh(record.id)}
                                >
                                    更新時間
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MapleBoss;
