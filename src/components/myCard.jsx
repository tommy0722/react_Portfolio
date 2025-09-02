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
        <Card className="modern-card">
            <div className="card-image-wrapper">
                <Card.Img
                    className="modern-card-img"
                    variant="top"
                    src={data.image || "https://via.placeholder.com/150"}
                />
                <div className="card-overlay">
                    <div className="overlay-content">
                        <i className="fas fa-eye view-icon"></i>
                        <p>查看詳情</p>
                    </div>
                </div>
            </div>
            <Card.Body className="modern-card-body">
                <Card.Title className="modern-card-title">{data.title || "Default Title"}</Card.Title>
                <Card.Text className="modern-card-text">{data.text || "Default Text"}</Card.Text>
                {isExternal ? (
                    <a
                        href={data.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modern-btn modern-btn-primary"
                    >
                        {data.buttonText || "Go somewhere"}
                        <i className="fas fa-external-link-alt btn-icon"></i>
                    </a>
                ) : (
                    <Button className="modern-btn modern-btn-primary" onClick={handleInternalNavigation}>
                        {data.buttonText || "Go somewhere"}
                        <i className="fas fa-arrow-right btn-icon"></i>
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
}

export default MyCard;
