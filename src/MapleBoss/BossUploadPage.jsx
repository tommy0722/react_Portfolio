import React, { useEffect, useState } from 'react';
import './MapleBoss.css';
import Select from 'react-select';
import axios from '../utils/axiosInstance';
import DataTable from 'react-data-table-component';

function MapleBoss() {
    const [now, setNow] = useState(new Date());
    const [serverId, setServerId] = useState('');
    const [bosses, setBosses] = useState([]);
    const [selectedBoss, setSelectedBoss] = useState('');
    const [selectedDrops, setSelectedDrops] = useState([]);
    const [records, setRecords] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filterText, setFilterText] = useState('');

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
        setLoading(true);
        axios.get('/maple/kill-records/recent/')
            .then(res => {
                // console.log('Kill Records:', res.data); 
                setRecords(res.data);
            })
            .finally(() => setLoading(false));
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
        if (nowMs < min) return 'waiting';
        if (nowMs <= max) return 'respawning';
        return 'overdue';
    }

    function getCountdownClass(record) {
        const status = getRespawnStatus(record);
        return {
            waiting: '',
            respawning: 'text-danger bg-warning-subtle fw-bold',
            overdue: 'text-white bg-danger fw-bold',
        }[status] || '';
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        const payload = {
            server_id: parseInt(serverId),
            boss: parseInt(selectedBoss),
            loots: selectedDrops,
        };
        axios.post('/maple/kill-records/', payload).then(() => {
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

    function handleHidden(id) {
        axios.post(`/maple/kill-records/${id}/hidden/`).then(fetchRecords)
            .catch(err => {
                const msg = err.response?.data?.detail || '更新失敗';
                alert(msg);
            });
    }

    const columns = [
        { name: '伺服器', selector: row => row.server_id, sortable: true },
        { name: 'BOSS', selector: row => row.boss.name, sortable: true },
        { name: '掉落物', selector: row => (row.loots || []).join(', ') },
        {
            name: '重生倒數', sortable: true,
            cell: row => (
                <span className={getCountdownClass(row)}>{getCountdownRange(row)}</span>
            ),
        },
        { name: '上傳者', selector: row => row.uploader.first_name, sortable: true },
        {
            name: '操作',
            cell: row => (
                <button className="btn btn-info btn-sm me-2" onClick={() => handleHidden(row.id)}>
                    隱藏
                </button>
            ),
        },
    ];

    const filteredRecords = records.filter(record =>
        record.boss.name.toLowerCase().includes(filterText.toLowerCase()) ||
        record.server_id.toString().includes(filterText)
    );

    const customStyles = {
        table: {
            style: {
                backgroundColor: '#1e1e2f',
            },
        },
        headRow: {
            style: {
                backgroundColor: '#1e1e2f',
            },
        },
        headCells: {
            style: {
                color: 'white',
                fontSize: '20px', 
            },
        },
        rows: {
            style: {
                backgroundColor: '#1e1e2f',  // ✅ 每一列都相同背景
                color: 'white',
                fontSize: '15px', 
            },
        },
        pagination: {
            style: {
                backgroundColor: '#1e1e2f',
                color: 'white',
            },
        },
    };

    return (
        <div className="maple-boss-container">
            <h1>楓之谷 BOSS 紀錄上傳</h1>

            <form onSubmit={handleSubmit} className="boss-form-inline mb-4">
                <input
                    type="number"
                    value={serverId}
                    onChange={e => setServerId(e.target.value)}
                    placeholder="伺服器 ID"
                    required
                    className="form-control form-control-sm me-2"
                    style={{ width: '120px' }}
                />
                <select
                    value={selectedBoss}
                    onChange={e => setSelectedBoss(e.target.value)}
                    required
                    className="form-select form-select-sm me-2"
                    style={{ width: '160px' }}
                >
                    <option value="">選擇 BOSS</option>
                    {bosses.map(boss => (
                        <option key={boss.id} value={boss.id}>{boss.name}</option>
                    ))}
                </select>
                <div style={{ minWidth: '250px', flexGrow: 1 }} className="me-2">
                    <Select
                        isMulti
                        options={(bosses.find(b => b.id === parseInt(selectedBoss))?.drop_items || []).map(item => ({
                            value: item.name,
                            label: item.name,
                        }))}
                        value={selectedDrops.map(name => ({ value: name, label: name }))}
                        onChange={selected => setSelectedDrops(selected.map(opt => opt.value))}
                        placeholder="搜尋或選擇掉落物"
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
            <input
                type="text"
                className="form-control form-control-sm mb-2"
                placeholder="搜尋 BOSS 名稱或伺服器 ID"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                style={{ maxWidth: '300px' }}
            />
            <DataTable
                columns={columns}
                data={filteredRecords}
                pagination
                paginationPerPage={50} // 預設每頁 50 筆
                paginationRowsPerPageOptions={[10, 25, 50, 100]} // 可選項目
                paginationComponentOptions={{
                    rowsPerPageText: '每頁筆數',         // ✅ 這邊改為中文
                    rangeSeparatorText: '共',
                    noRowsPerPage: false,
                    selectAllRowsItem: false,
                }}
                highlightOnHover 
                responsive
                // dense 
                progressPending={loading}
                noDataComponent="目前尚無資料"
                customStyles={customStyles}
                striped={false}  // ✅ 關閉斑馬紋
            />
        </div>
    );
}

export default MapleBoss;
