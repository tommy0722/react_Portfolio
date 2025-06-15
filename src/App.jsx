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


function App() {

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
