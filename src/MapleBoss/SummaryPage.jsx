import React, { useEffect, useState } from 'react';
import { Table, Container, ButtonGroup, Button } from 'react-bootstrap';
import './SummaryPage.css';
import axios from '../utils/axiosInstance';

function KillSummaryPage() {
    const [summary, setSummary] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all' 或 'today'

    useEffect(() => {
        fetchKillSummary();
    }, [filter]);

    function fetchKillSummary() {
        const url = filter === 'today' ? 'maple/kill-summary/?today=true' : 'maple/kill-summary/';
        axios.get(url).then(res => setSummary(res.data));
    }

    return (
        <div className="Container">
            <h1 className='text-center'>擊殺統計</h1>

            <div className="text-center mb-3">
                <ButtonGroup>
                    <Button
                        variant={filter === 'all' ? 'primary' : 'outline-primary'}
                        onClick={() => setFilter('all')}
                    >
                        所有
                    </Button>
                    <Button
                        variant={filter === 'today' ? 'success' : 'outline-success'}
                        onClick={() => setFilter('today')}
                    >
                        今天
                    </Button>
                </ButtonGroup>
            </div>

            <table
                className="table table-primary table-bordered table-sm text-center my-3"
                style={{
                    verticalAlign: 'middle', 
                }}
            >
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
