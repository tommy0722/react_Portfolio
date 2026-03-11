import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import MyCard from './components/myCard';
import image1 from './assets/Frieren.jpg';
import image2 from './assets/Pwclolr.jpg';
import image3 from './assets/Roulette.jpg';
import MapleStory from './assets/MapleStory.jpg';
import Invoice from './assets/invoice.jpg';
import Scheduler from './assets/scheduler.jpg';
import NTHU from './assets/NTHU.jpg';

function ContentTabs() {
    const cssData = [
        {
            title: "色塊拼圖",
            text: "這是一個放兩張圖片，透過滑動來解開第二張圖片的動畫",
            image: image1,
            link: "/JigsawArt",
            buttonText: "連結",
        },
        {
            title: "色塊拼圖",
            text: "這是一個放兩張圖片，透過滑動來解開第二張圖片的動畫",
            image: image1,
            link: "/JigsawArt",
            buttonText: "連結",
        },
    ];
    const jsData = [
        {
            title: "密碼強度判斷",
            text: "確認密碼強度的顏色牆",
            image: image2,
            link: "/pwColor",
            buttonText: "連結",
        },
    ];
    const backendData = [
        {
            title: "輪盤系統",
            text: "今天吃甚麼的輪盤 - Django + React 全端應用",
            image: image3,
            link: "/roulette",
            buttonText: "連結",
        },
        {
            title: "楓之谷打王紀錄",
            text: "楓之谷打王紀錄系統",
            image: MapleStory,
            link: "/mapleboss",
            buttonText: "連結",
        },
    ];

    // Django 後端專案（含技術文件）
    const djangoBackendData = [
        {
            title: "自動排班系統",
            text: "企業自動排班系統 - 智能演算法 + 多租戶架構 + WebSocket 即時通知",
            image: Scheduler, 
            link: "https://github.com/tommy0722/react_Portfolio", // 替換成你的 GitHub
            buttonText: "GitHub",
            techDoc: "/docs/排班系統架構圖.md",
        },
        {
            title: "清華幼兒發展評估系統",
            text: "教育研究資料管理系統 - Pandas ETL + Excel 批次匯入 + 標準化評估量表",
            image: NTHU, 
            link: "https://github.com/tommy0722/react_Portfolio",
            buttonText: "GitHub",
            techDoc: "/docs/清華幼兒發展評估系統架構圖.md",
        },
        {
            title: "智能發票辨識系統",
            text: "會計自動化系統 - OCR 辨識 + 自動分類 + 財務報表生成",
            image: Invoice, 
            link: "https://github.com/tommy0722/react_Portfolio",
            buttonText: "GitHub",
            techDoc: "/docs/發票辨識架構圖.md",
        },
    ];

    return (
        <div className='container main-content'>
            <div className="hero-section">
                <h1 className="hero-title">我的作品集</h1>
                <p className="hero-subtitle">探索我的程式作品和專案展示</p>
            </div>
            <Tabs defaultActiveKey="css" className="custom-tabs">
                <Tab eventKey="css" title="🎨 CSS動畫">
                    <div className="tab-content-wrapper">
                        <div className="row g-4">
                            {cssData.map((card, index) => (
                                <div className="col-lg-4 col-md-6" key={index}>
                                    <MyCard data={card} />
                                </div>
                            ))}
                        </div>
                    </div>
                </Tab>
                <Tab eventKey="js" title="⚡ JavaScript">
                    <div className="tab-content-wrapper">
                        <div className="row g-4">
                            {jsData.map((card, index) => (
                                <div className="col-lg-4 col-md-6" key={index}>
                                    <MyCard data={card} />
                                </div>
                            ))}
                        </div>
                    </div>
                </Tab>
                <Tab eventKey="backend" title="🚀 全端專案">
                    <div className="tab-content-wrapper">
                        <div className="row g-4">
                            {backendData.map((card, index) => (
                                <div className="col-lg-4 col-md-6" key={index}>
                                    <MyCard data={card} />
                                </div>
                            ))}
                        </div>
                    </div>
                </Tab>
                <Tab eventKey="django" title="🐍 Django 後端">
                    <div className="tab-content-wrapper">
                        <div className="alert alert-info mb-4">
                            <i className="fas fa-info-circle me-2"></i>
                            以下專案為私人倉庫，提供完整技術架構文件供參考
                        </div>
                        <div className="row g-4">
                            {djangoBackendData.map((card, index) => (
                                <div className="col-lg-4 col-md-6" key={index}>
                                    <MyCard data={card} />
                                </div>
                            ))}
                        </div>
                    </div>
                </Tab>

            </Tabs>
        </div>
    );
}

export default ContentTabs;
