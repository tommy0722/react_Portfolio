import React, { useEffect, useState } from 'react';
import { Table, Container } from 'react-bootstrap';
import './SummaryPage.css';
import axios from '../utils/axiosInstance';

function KillSummaryPage() {
    const [summary, setSummary] = useState([]);

    useEffect(() => {
    fetchKillSummary();
    }, []);
    function fetchKillSummary() {
        axios.get('maple/kill-summary/').then(res => setSummary(res.data));
    }

    return (
        <Container className="mt-4 Container">
            <h1 className='text-center'>擊殺統計</h1>
            <table className="table-primary table-bordered table-sm text-center" style={{ color: 'white' }}>
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
                            <td>{item.loots.join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Container>
    );
}

export default KillSummaryPage;
