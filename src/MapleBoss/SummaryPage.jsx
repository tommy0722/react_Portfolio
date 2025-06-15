import React, { useEffect, useState } from 'react';
import { Table, Container } from 'react-bootstrap';

function KillSummaryPage() {
    const [summary, setSummary] = useState([]);

    useEffect(() => {
        fetch('https://myweb-backend-571409330129.asia-east1.run.app/api/maple/kill-summary/')
            .then(res => res.json())
            .then(data => setSummary(data))
            .catch(err => console.error('讀取統計資料失敗', err));
    }, []);

    return (
        <Container className="mt-4">
            <h1 className='text-center'>擊殺統計</h1>
            <Table striped bordered hover>
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
            </Table>
        </Container>
    );
}

export default KillSummaryPage;
