import React, { useState, useEffect, useRef } from 'react';

const LazyImage = ({ 
    src, 
    alt, 
    placeholder = "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23999999'%3ELoading...%3C/text%3E%3C/svg%3E",
    className = "",
    style = {},
    ...props 
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
    };

    return (
        <div 
            ref={imgRef} 
            className={`lazy-image-container ${className}`} 
            style={style}
        >
            {hasError ? (
                <div className="error-placeholder d-flex align-items-center justify-content-center bg-light text-muted" style={{ height: '100%', minHeight: '200px' }}>
                    <div className="text-center">
                        <i className="fas fa-image text-muted mb-2" style={{ fontSize: '2rem' }}></i>
                        <p>圖片載入失敗</p>
                    </div>
                </div>
            ) : (
                <>
                    {!isLoaded && (
                        <img
                            src={placeholder}
                            alt="loading"
                            className={`placeholder-image ${className}`}
                            style={{
                                ...style,
                                filter: 'blur(2px)',
                                transition: 'opacity 0.3s ease'
                            }}
                        />
                    )}
                    {isInView && (
                        <img
                            src={src}
                            alt={alt}
                            className={className}
                            style={{
                                ...style,
                                opacity: isLoaded ? 1 : 0,
                                transition: 'opacity 0.3s ease'
                            }}
                            onLoad={handleLoad}
                            onError={handleError}
                            {...props}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default LazyImage;