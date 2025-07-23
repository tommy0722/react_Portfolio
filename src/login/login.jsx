// src/pages/Login.js
import React from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';


function Login() {
    const handleSuccess = async (credentialResponse) => {
        const { credential } = credentialResponse;

        try {
            const response = await axios.post('https://myweb-backend-571409330129.asia-east1.run.app/api/google-login/', {
                token: credential,
            });

            const { access, refresh,email,name } = response.data;
            
            // 儲存 JWT token
            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);
            localStorage.setItem('user_email', email);
            localStorage.setItem('user_name', name);

            alert('登入成功！');
            // 可選：導向主頁或 dashboard
            window.location.href = '/mapleboss';

        } catch (error) {
            console.error('登入失敗', error);
            alert('登入失敗，請重試');
        }
    };

    const handleError = () => {
        alert('Google 登入失敗');
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h2 className="text-center">登入</h2>
                    <Form>
                        <Form.Group>
                            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
