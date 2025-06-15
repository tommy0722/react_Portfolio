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
            link: "https://myweb-backend-571409330129.asia-east1.run.app",
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
        <div className='container'>
            <p>現在沒有確定的作品集，只是先亂放</p>
            <Tabs defaultActiveKey="css" className="mb-3">
                <Tab eventKey="css" title="CSS">
                    <div className="row g-3" style={{ padding: '20px' }}>
                        {cssData.map((card, index) => (
                            <div className="col-md-4" key={index}>
                                <MyCard data={card} />
                            </div>
                        ))}
                    </div>
                </Tab>
                <Tab eventKey="js" title="JS">
                    <div className="row g-3" style={{ padding: '20px' }}>
                        {jsData.map((card, index) => (
                            <div className="col-md-4" key={index}>
                                <MyCard data={card} />
                            </div>
                        ))}
                    </div>
                </Tab>
                <Tab eventKey="backend" title="後端">
                    <div className="row g-3" style={{ padding: '20px' }}>
                        {backendData.map((card, index) => (
                            <div className="col-md-4" key={index}>
                                <MyCard data={card} />
                            </div>
                        ))}
                    </div>
                </Tab>

            </Tabs>
        </div>
    );
}

export default ContentTabs;
