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
        <Container fluid style={{ backgroundColor: '#f8f9fa', padding: '10px 0' }}>
            <Row className="align-items-center">
                {/* 左邊空白 */}
                <Col xs={4}></Col>

                {/* 中間 MyApp */}
                <Col xs={4} className="text-center">
                    <Link
                        to="/"
                        style={{
                            textDecoration: 'none',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#000'
                        }}
                    >
                        MyApp
                    </Link>
                </Col>

                {/* 右側：登入 or 使用者名稱 + 登出 */}
                <Col xs={4} style={{ textAlign: 'right', paddingRight: '50px' }}>
                    {userName ? (
                        <>
                            <span style={{ marginRight: '20px', color: 'black' }}>歡迎~{userName}</span>
                            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                                登出
                            </Button>
                        </>
                    ) : (
                        <Link to="/login" className="custom-hover">
                            登入
                        </Link>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default NavigationBar;
