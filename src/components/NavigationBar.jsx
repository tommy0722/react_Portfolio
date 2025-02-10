import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NavigationBar.css';

function NavigationBar() {
    return (
        <Container fluid style={{ backgroundColor: '#f8f9fa', padding: '10px 0' }}>
            <Row className="align-items-center">
                {/* 左邊空白 */}
                <Col xs={4}></Col>
                {/* 中間 MyApp */}
                <Col xs={4} className="text-center">
                    <Link to="/" style={{ textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>
                        MyApp
                    </Link>
                </Col>
                {/* 右側 登入 */}
                <Col xs={4} style={{ textAlign: 'right', paddingRight: '50px' }}>
                    <Link to="/login" className='custom-hover' >
                        登入
                    </Link>
                </Col>
            </Row>
        </Container>
    );
}

export default NavigationBar;
