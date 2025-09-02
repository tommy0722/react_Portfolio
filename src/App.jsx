import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JigsawArt from './JigsawArt/JigsawArt';
import PwColor from './PwColor/PwColor';
import Login from './login/login';
import NavigationBar from './components/NavigationBar';
import ContentTabs from './tab';
import MapleBoss from './MapleBoss/MapleBoss';
import ErrorBoundary from './components/ErrorBoundary';
import { UserProvider } from './context/UserContext';

function App() {
    return (
        <ErrorBoundary>
            <UserProvider>
                <Router>
                    <NavigationBar />
                    <Routes>
                        <Route path="/JigsawArt" element={<JigsawArt />} />
                        <Route path="/pwColor" element={<PwColor />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<ContentTabs />} />
                        <Route path="/mapleboss" element={<MapleBoss />} />
                    </Routes>
                </Router>
            </UserProvider>
        </ErrorBoundary>
    );
}

export default App;
