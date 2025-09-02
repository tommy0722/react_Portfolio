import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './NavigationBar.css';
import { useUser } from '../hooks/useUser';

function NavigationBar() {
    const { userName, logout, loading } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <Container fluid className="modern-navbar">
            <Row className="align-items-center">
                {/* 左邊空白 */}
                <Col xs={4}></Col>

                {/* 中間 MyApp */}
                <Col xs={4} className="text-center">
                    <Link to="/" className="brand-logo">
                        MyApp
                    </Link>
                </Col>

                {/* 右側：登入 or 使用者名稱 + 登出 */}
                <Col xs={4} className="user-section">
                    {loading ? (
                        <div className="spinner-border spinner-border-sm text-light" role="status">
                            <span className="visually-hidden">載入中...</span>
                        </div>
                    ) : userName ? (
                        <div className="user-info">
                            <span className="welcome-text">歡迎 {userName}</span>
                            <Button variant="outline-light" size="sm" className="logout-btn" onClick={handleLogout}>
                                登出
                            </Button>
                        </div>
                    ) : (
                        <Link to="/login" className="login-link">
                            登入
                        </Link>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default NavigationBar;
