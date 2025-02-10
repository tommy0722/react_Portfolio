import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

function MyCard({ data }) {
    const navigate = useNavigate();
    const isExternal = data.link.startsWith('http');
    

    const handleInternalNavigation = () => {
        navigate(data.link); // 跳轉到對應的內部路由
    };

    return (
        <Card style={{ width: '18rem', textAlign: 'center' }}>
            <Card.Img
                style={{
                    width: '285px',
                    height: '290px',
                    display: 'block',
                    margin: '0 auto',
                }}
                variant="top"
                src={data.image || "https://via.placeholder.com/150"}
            />
            <Card.Body>
                <Card.Title>{data.title || "Default Title"}</Card.Title>
                <Card.Text>{data.text || "Default Text"}</Card.Text>
                {isExternal ? (
                    <a
                        href={data.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                    >
                        {data.buttonText || "Go somewhere"}
                    </a>
                ) : (
                    <Button variant="primary" onClick={handleInternalNavigation}>
                        {data.buttonText || "Go somewhere"}
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
}

export default MyCard;
