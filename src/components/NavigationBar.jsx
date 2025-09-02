import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './NavigationBar.css';
import { UserContext } from '../context/UserContext';

function NavigationBar() {
    const { userName, logout } = useContext(UserContext);
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
                    {userName ? (
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
