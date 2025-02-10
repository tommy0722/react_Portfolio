import React, { useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MyCard from './components/myCard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JigsawArt from './JigsawArt/JigsawArt'; // 導入 ProjectA
import PwColor from './PwColor/PwColor'; // 導入 ProjectB
import Login from './login/login';
import LoginButton from './login/loginButton';
import NavigationBar from './components/NavigationBar'; 
import ContentTabs from './tab'; 
import image1 from './assets/Frieren.jpg';
import image2 from './assets/Pwclolr.jpg';
import image3 from './assets/Roulette.jpg';

function RedirectToExternal({ url }) {
    useEffect(() => {
        window.location.href = url;
    }, [url]);
    return null;
}

function App() {
    const cardsData = [
        {
            title: "色塊拼圖",
            text: "這是一個放兩張圖片，透過滑動來解開第二張圖片的動畫",
            image: image1,
            link: "/JigsawArt",
            buttonText: "連結",
        },
        {
            title: "密碼強度判斷",
            text: "確認密碼強度的顏色牆",
            image: image2,
            link: "/pwColor",
            buttonText: "連結",
        },
        {
            title: "輪盤系統",
            text: "今天吃甚麼的輪盤(外部連結)",
            image: image3,
            // 使用完整外部連結
            link: "https://myweb-backend-571409330129.asia-east1.run.app",
            buttonText: "連結",
        },
    ];

    return (
        <Router>
            <NavigationBar />
            <Routes>
                {/* ProjectA 路由 */}
                <Route path="/JigsawArt" element={<JigsawArt />} />
                {/* ProjectB 路由 */}
                <Route path="/pwColor" element={<PwColor />} />
                {/* login 路由 */}
                <Route path="/login" element={<Login />} />
                {/* tab 路由 */}
                <Route path="/" element={<ContentTabs />} />
            </Routes>
        </Router>
    );
}
export default App;
