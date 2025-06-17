// src/pages/MapleBoss.jsx
import React, { useState } from 'react';
import BossUploadPage from './BossUploadPage';
import SummaryPage from './SummaryPage';
import BossTablePage from './BossTablePage'; // ⬅️ 假設你這是打王總表頁

function MapleBoss() {
    const [activePage, setActivePage] = useState('boss'); // 'boss', 'summary', or 'table'

    return (
        <div className="container py-4">
            <h1 className="h4 fw-bold mb-4 text-center">楓之谷 Boss 工具</h1>

            <div className="mb-4 d-flex justify-content-around">
                <button
                    className={`btn ${activePage === 'boss' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActivePage('boss')}
                    style={{ minWidth: '200px' }}
                >
                    🗡️ 打王記錄(48H)
                </button>
                <button
                    className={`btn ${activePage === 'summary' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setActivePage('summary')}
                    style={{ minWidth: '200px' }}
                >
                    📊 掉寶統計
                </button>
                <button
                    className={`btn ${activePage === 'table' ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={() => setActivePage('table')}
                    style={{ minWidth: '200px' }}
                >
                    📋 打王總表
                </button>
            </div>


            <div className="border rounded p-4 shadow-sm bg-light">
                {activePage === 'boss' && <BossUploadPage />}
                {activePage === 'summary' && <SummaryPage />}
                {activePage === 'table' && <BossTablePage />}
            </div>
        </div>
    );
}

export default MapleBoss;
