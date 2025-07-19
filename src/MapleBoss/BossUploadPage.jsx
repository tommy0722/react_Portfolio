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
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    function getRespawnDisplay(record, now) {
        if (!record?.kill_time) {
            return {
                className: 'status-unknown',
                text: '-',
                status: 'unknown',
            };
        }

        const killTime = new Date(record.kill_time);
        const min = new Date(killTime.getTime() + record.boss.respawn_min_minutes * 60000);
        const max = new Date(killTime.getTime() + record.boss.respawn_max_minutes * 60000);
        const nowMs = now.getTime();

        if (nowMs < min) {
            return {
                className: 'status-waiting',
                text: `${formatTime(min - now)} ~ ${formatTime(max - now)}`,
                status: 'waiting',
            };
        }

        if (nowMs <= max) {
            const mins = Math.ceil((max - now) / 60000);
            return {
                className: 'status-respawning',
                text: `約 ${mins} 分鐘內倒數完畢`,
                status: 'respawning',
            };
        }

        return {
            className: 'status-overdue',
            text: '已重生',
            status: 'overdue',
        };
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (isSubmitting) return; // 防止重複送出

        setIsSubmitting(true);

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
        }).catch(() => {
            alert('發生錯誤');
        }).finally(() => {
            setIsSubmitting(false);
        });
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
    function handleHidden(id) {
        axios.post(`/maple/kill-records/${id}/hidden/`).then(() => {
            fetchRecords();
        })
            .catch(err => {
                const msg = err.response?.data?.detail || '更新失敗';
                alert(msg);
            });
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

                <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? '送出中...' : '送出'}
                </button>

            </form>

            <h2>擊殺紀錄</h2>
            <div className="mb-3">
                <label className="form-label text-white">篩選 BOSS</label>
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
            <div className="boss-card-container">
                {
                    records
                        .filter(record =>
                            selectedBossFilter === '' || record.boss.name === selectedBossFilter
                        )
                        .map(record => {
                            const display = getRespawnDisplay(record, now);

                            return (
                                <div className="boss-card" key={record.id}>
                                    <div className="boss-card-header">
                                        <img
                                            src={`/assets/BOSS/${record.boss.id}.jpg`}

                                            alt="boss"
                                            className="boss-avatar"
                                        />
                                        <div className="boss-info">
                                            <div className="boss-name">{record.boss.name}</div>
                                            <div className="boss-server">頻道 {record.server_id}</div>
                                        </div>
                                        <button className="delete-btn" onClick={() => handleHidden(record.id)}>
                                            🗑
                                        </button>
                                    </div>

                                    <div className="boss-timer">
                                        <span className={display.className}>
                                            ⏱ {display.text}
                                        </span>
                                    </div>
                                    <div className="boss-info">
                                            發現者 ：{record.uploader.first_name} 
                                    </div>
                                </div>
                            );
                        })}
            </div>

        </div>
    );
}

export default MapleBoss;