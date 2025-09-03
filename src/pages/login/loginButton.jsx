import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function LoginButton() {
    return (
        <Link to="/login">
            <Button variant="primary">登入</Button>
        </Link>
    );
}

export default LoginButton;
