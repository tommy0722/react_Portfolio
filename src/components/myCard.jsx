import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

function MyCard({ data }) {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate(data.link); // 跳轉到對應的內部路由
    };

    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={data.image || "https://via.placeholder.com/150"} />
            <Card.Body>
                <Card.Title>{data.title || "Default Title"}</Card.Title>
                <Card.Text>{data.text || "Default Text"}</Card.Text>
                <Button variant="primary" onClick={handleButtonClick}>
                    {data.buttonText || "Go somewhere"}
                </Button>
            </Card.Body>
        </Card>
    );
}

export default MyCard;
