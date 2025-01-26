import React from 'react';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import ProjectA from './JigsawArt/AppA';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import MyCard from './components/myCard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppA from './JigsawArt/AppA'; // 導入 ProjectA
import AppB from './ProjectB/AppB'; // 導入 ProjectB
import image1 from './assets/Frieren.jpg';

function App() {
    const cardsData = [
        {
            title: "色塊拼圖",
            text: "這是一個放兩張圖片，透過滑動來解開第二張圖片的動畫",
            image: image1,
            link: "/project-a", // 跳轉到 ProjectA
            buttonText: "連結",
        },
        {
            title: "Project B",
            text: "This is the second project.",
            image: "https://via.placeholder.com/150",
            link: "/project-b", // 跳轉到 ProjectB
            buttonText: "Go to Project B",
        },
    ];

    return (
        <Router>
            <Routes>
                {/* 主頁：卡片列表 */}
                <Route
                    path="/"
                    element={
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                            {cardsData.map((card, index) => (
                                <MyCard key={index} data={card} />
                            ))}
                        </div>
                    }
                />
                {/* ProjectA 路由 */}
                <Route path="/project-a" element={<AppA />} />
                {/* ProjectB 路由 */}
                <Route path="/project-b" element={<AppB />} />
            </Routes>
        </Router>
    );
}
export default App;
