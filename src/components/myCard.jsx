import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

function MyCard({ data }) {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate(data.link); // 跳轉到對應的內部路由
    };

    return (
        <Card style={{ width: '18rem', textAlign: 'center' }}> {/* 確保內容置中 */}
            <Card.Img
                style={{
                    width: '285px',
                    height: '290px',
                    display: 'block', // 讓圖片成為區塊元素
                    margin: '0 auto', // 水平置中
                }}
                variant="top"
                src={data.image || "https://via.placeholder.com/150"}
            />
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
