import React, { Suspense, lazy } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import ErrorBoundary from './components/ErrorBoundary';
import { UserProvider } from './context/UserContext';

// 懶載入組件
const JigsawArt = lazy(() => import('./pages/JigsawArt/JigsawArt'));
const PwColor = lazy(() => import('./pages/PwColor/PwColor'));
const Login = lazy(() => import('./pages/login/login'));
const ContentTabs = lazy(() => import('./tab'));
const MapleBoss = lazy(() => import('./pages/MapleBoss/MapleBoss'));
const RouletteWheel = lazy(() => import('./pages/RouletteWheel'));
const Game24 = lazy(() => import('./pages/Game24/Game24'));
const AccountingPage = lazy(() => import('./pages/Accounting/AccountingPage'));

// 載入中組件
const PageLoading = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <div className="text-center">
            <div className="spinner-border mb-3" style={{ width: '3rem', height: '3rem', color: 'var(--gb-bright)' }} role="status">
                <span className="visually-hidden">載入中...</span>
            </div>
            <p style={{ color: 'var(--gb-bright)', fontFamily: "'Press Start 2P', monospace", fontSize: '0.6rem', letterSpacing: '2px' }}>LOADING...</p>
        </div>
    </div>
);

function App() {
    return (
        <ErrorBoundary>
            <UserProvider>
                <Router>
                    <NavigationBar />
                    <Suspense fallback={<PageLoading />}>
                        <Routes>
                            <Route path="/JigsawArt" element={<JigsawArt />} />
                            <Route path="/pwColor" element={<PwColor />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={<ContentTabs />} />
                            <Route path="/mapleboss" element={<MapleBoss />} />
                            <Route path="/roulette/*" element={<RouletteWheel />} />
                            <Route path="/game24" element={<Game24 />} />
                            <Route path="/accounting" element={<AccountingPage />} />
                        </Routes>
                    </Suspense>
                </Router>
            </UserProvider>
        </ErrorBoundary>
    );
}

export default App;
