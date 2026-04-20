// src/pages/login/login.jsx
import React from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { TokenManager } from '../../services/axiosInstance';
import { useUser } from '../../hooks/useUser';

function Login() {
    const navigate = useNavigate();
    const { login } = useUser();

    const handleSuccess = async (credentialResponse) => {
        const { credential } = credentialResponse;

        try {
            const response = await axiosInstance.post('/auth/google/', {
                token: credential,
            });

            const { access, refresh, email, name } = response.data;

            // 儲存 JWT token
            TokenManager.setToken('access', access);
            TokenManager.setToken('refresh', refresh);

            // 更新全域 UserContext 狀態（同步更新 NavBar 等元件）
            login(email, name);

            // 導向主頁
            navigate('/mapleboss');

        } catch (error) {
            console.error('登入失敗', error);
            alert(error.message || '登入失敗，請重試');
        }
    };

    const handleError = () => {
        alert('Google 登入失敗，請重試');
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h2 className="text-center">登入</h2>
                    <Form>
                        <Form.Group className="d-flex justify-content-center mt-3">
                            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
