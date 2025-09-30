import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import MyCard from './components/myCard';
import image1 from './assets/Frieren.jpg';
import image2 from './assets/Pwclolr.jpg';
import image3 from './assets/Roulette.jpg';
import MapleStory from './assets/MapleStory.jpg';

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
            text: "今天吃甚麼的輪盤(外部連結)",
            image: image3,
            link: "/roulette",
            buttonText: "連結",
        },
        {
            title: "楓之谷打王紀錄",
            text: "楓之谷打王紀錄說明 ",
            image: MapleStory,
            link: "/mapleboss",
            buttonText: "連結",
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
                <Tab eventKey="backend" title="🚀 後端專案">
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

            </Tabs>
        </div>
    );
}

export default ContentTabs;
