// src/pages/MapleBoss.jsx
import React, { useState } from 'react';
import './MapleBoss.css';
import BossUploadPage from './BossUploadPage';
import SummaryPage from './SummaryPage';
import BossTablePage from './BossTablePage'; 
import UnitConversion from './unitConversion'; 

function MapleBoss() {
    const [activePage, setActivePage] = useState('boss'); // 'boss', 'summary', or 'table'

    return (
        <div style={{ width: '80%', margin: '0 auto', padding: '20px' }}>
            <h1 className="maple-page-title">楓之谷 Boss 工具</h1>

            <div className="maple-nav-group">
                <button
                    className={`maple-nav-btn ${activePage === 'boss' ? 'active' : ''}`}
                    onClick={() => setActivePage('boss')}
                >
                    🗡️ 打王記錄(36H)
                </button>
                <button
                    className={`maple-nav-btn ${activePage === 'summary' ? 'active' : ''}`}
                    onClick={() => setActivePage('summary')}
                >
                    📊 掉寶統計
                </button>
                <button
                    className={`maple-nav-btn ${activePage === 'table' ? 'active' : ''}`}
                    onClick={() => setActivePage('table')}
                >
                    📋 打王總表
                </button>
                <button
                    className={`maple-nav-btn ${activePage === 'unitConversion' ? 'active' : ''}`}
                    onClick={() => setActivePage('unitConversion')}
                >
                    💱 單位換算
                </button>
            </div>

            <div className="maple-content-wrapper">
                {activePage === 'boss' && <BossUploadPage />}
                {activePage === 'summary' && <SummaryPage />}
                {activePage === 'table' && <BossTablePage />}
                {activePage === 'unitConversion' && <UnitConversion />}
            </div>
        </div>
    );
}

export default MapleBoss;
