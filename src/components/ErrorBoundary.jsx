import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null, 
            errorInfo: null 
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <Container className="d-flex justify-content-center align-items-center min-vh-100">
                    <div className="text-center" style={{ maxWidth: '600px' }}>
                        <div className="mb-4">
                            <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '4rem' }}></i>
                        </div>
                        
                        <h2 className="mb-3 text-white">哎呀！出現了一些錯誤</h2>
                        
                        <Alert variant="danger" className="mb-4">
                            <Alert.Heading>錯誤資訊</Alert.Heading>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo.componentStack}
                        </Alert>

                        <div className="d-flex gap-3 justify-content-center">
                            <Button 
                                variant="primary" 
                                size="lg" 
                                onClick={this.handleReload}
                                className="modern-btn"
                            >
                                <i className="fas fa-refresh me-2"></i>
                                重新載入
                            </Button>
                            
                            <Button 
                                variant="outline-light" 
                                size="lg" 
                                onClick={this.handleGoHome}
                                className="modern-btn"
                            >
                                <i className="fas fa-home me-2"></i>
                                回到首頁
                            </Button>
                        </div>

                        <div className="mt-4 text-muted">
                            <small>
                                如果問題持續發生，請聯繫技術支援
                            </small>
                        </div>
                    </div>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;