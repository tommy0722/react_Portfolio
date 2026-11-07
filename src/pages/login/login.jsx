// src/pages/login/login.jsx
import { useEffect, useState } from 'react';
import { Alert, Container, Row, Col, Spinner } from 'react-bootstrap';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { TokenManager } from '../../services/axiosInstance';
import { useUser } from '../../hooks/useUser';

function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated, loading: userLoading } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!userLoading && isAuthenticated) {
            navigate('/mapleboss', { replace: true });
        }
    }, [userLoading, isAuthenticated, navigate]);

    const handleSuccess = async (credentialResponse) => {
        const { credential } = credentialResponse;
        setErrorMessage('');
        setIsSubmitting(true);

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
            navigate('/mapleboss', { replace: true });

        } catch (error) {
            console.error('登入失敗', error);
            setErrorMessage(error.message || '登入失敗，請重試');
            setIsSubmitting(false);
        }
    };

    const handleError = () => {
        setErrorMessage('Google 登入失敗，請重試');
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h2 className="text-center">登入</h2>

                    {errorMessage && (
                        <Alert variant="danger" className="mt-3" dismissible onClose={() => setErrorMessage('')}>
                            {errorMessage}
                        </Alert>
                    )}

                    <div className="d-flex justify-content-center mt-3">
                        {isSubmitting ? (
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">登入中...</span>
                            </Spinner>
                        ) : (
                            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
