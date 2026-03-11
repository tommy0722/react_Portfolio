import React, { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal } from 'react-bootstrap';
import LazyImage from './LazyImage';

const MyCard = memo(({ data }) => {
    const navigate = useNavigate();
    const isExternal = data.link.startsWith('http');
    const [showModal, setShowModal] = useState(false);

    const handleInternalNavigation = useCallback(() => {
        navigate(data.link);
    }, [navigate, data.link]);

    const handleImageClick = useCallback((e) => {
        e.stopPropagation();
        setShowModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
    }, []);

    return (
        <>
            <Card className="modern-card">
                <div className="card-image-wrapper" onClick={handleImageClick} style={{ cursor: 'pointer' }}>
                    <LazyImage
                        src={data.image || "https://via.placeholder.com/150"}
                        alt={data.title}
                        className="modern-card-img"
                    />
                    <div className="card-overlay">
                        <div className="overlay-content">
                            <i className="fas fa-search-plus view-icon"></i>
                            <p>查看大圖</p>
                        </div>
                    </div>
                </div>
                <Card.Body className="modern-card-body">
                    <Card.Title className="modern-card-title">{data.title || "Default Title"}</Card.Title>
                    <Card.Text className="modern-card-text">{data.text || "Default Text"}</Card.Text>
                    <div className="d-flex gap-2 flex-wrap">
                        {isExternal ? (
                            <a
                                href={data.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="modern-btn modern-btn-primary flex-grow-1"
                            >
                                {data.buttonText || "Go somewhere"}
                                <i className="fas fa-external-link-alt btn-icon"></i>
                            </a>
                        ) : (
                            <Button className="modern-btn modern-btn-primary flex-grow-1" onClick={handleInternalNavigation}>
                                {data.buttonText || "Go somewhere"}
                                <i className="fas fa-arrow-right btn-icon"></i>
                            </Button>
                        )}
                        {data.techDoc && (
                            <a
                                href={data.techDoc}
                                download
                                className="modern-btn modern-btn-secondary"
                                title="下載技術文件"
                            >
                                <i className="fas fa-file-download"></i> 技術文件
                            </a>
                        )}
                    </div>
                </Card.Body>
            </Card>

            {/* 圖片放大 Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                <Modal.Header closeButton style={{ background: '#1a1a2e', border: 'none' }}>
                    <Modal.Title style={{ color: 'white' }}>{data.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: '#1a1a2e', padding: 0 }}>
                    <img
                        src={data.image || "https://via.placeholder.com/150"}
                        alt={data.title}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
});

MyCard.displayName = 'MyCard';

export default MyCard;
