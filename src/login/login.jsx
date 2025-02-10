import React from 'react';
import { Form, Button } from 'react-bootstrap';

function Login() {
    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            <h2>登入</h2>
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>電子信箱</Form.Label>
                    <Form.Control type="email" placeholder="輸入電子信箱" />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" style={{ marginTop: '10px' }}>
                    <Form.Label>密碼</Form.Label>
                    <Form.Control type="password" placeholder="輸入密碼" />
                </Form.Group>

                <Button variant="primary" type="submit" style={{ marginTop: '20px' }}>
                    登入
                </Button>
            </Form>
        </div>
    );
}

export default Login;
