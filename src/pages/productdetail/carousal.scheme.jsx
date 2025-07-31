import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';

export default function CarouselScheme({ onSchemeClick }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [showArrows, setShowArrows] = useState(false);

    const navigate = useNavigate();
    
    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;
    
    // Check if device is mobile
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768); // md breakpoint
        };
        
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);
    
    var items = [
        {
            imageName: "22.webp",
            alt: "scheme1",
            schemeId: 1,
            link: "/schemes/form?plan=1"
        },
        {
            imageName: "23.webp",
            alt: "scheme2",
            schemeId: 2,
            link: "/schemes/form?plan=2"
        },
        {
            imageName: "24.webp",
            alt: "scheme3",
            schemeId: 3,
            link: "/schemes/form?plan=3"
        }
    ]

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === items.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? items.length - 1 : prevIndex - 1
        );
    };

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        }
        if (isRightSwipe) {
            prevSlide();
        }
    };

    const handleSchemeClick = () => {
        if (onSchemeClick) {
            onSchemeClick(items[currentIndex].schemeId);
        }
    };

    return (
        <div style={{ 
            position: 'relative',
                width: {
                    xs: "100%", // width for extra-small devices (phones)
                    sm: "100%", // width for small devices (tablets)
                    md: "98%", // width for medium and larger devices
                },
            margin: "auto"
        }}>
            <div 
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    touchAction: 'pan-y pinch-zoom'
                }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onMouseEnter={() => setShowArrows(true)}
                onMouseLeave={() => setShowArrows(false)}
            >
                <Item item={items[currentIndex]} onSchemeClick={handleSchemeClick} navigate={navigate} />
                
                {/* Left Navigation Button - Only show on desktop */}
                {!isMobile && (
                    <IconButton
                        sx={{
                            position: "absolute",
                            left: showArrows ? "10px" : "-50px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "transparent",
                            color: "white",
                            zIndex: 2,
                            backdropFilter: "blur(8px)",
                            transition: "left 0.3s ease",
                            "&:hover": {
                                background: "rgba(255, 255, 255, 0.2)",
                                backdropFilter: "blur(12px)",
                            }
                        }}
                        onClick={prevSlide}
                    >
                        <ChevronLeft />
                    </IconButton>
                )}
                
                {/* Right Navigation Button - Only show on desktop */}
                {!isMobile && (
                    <IconButton
                        sx={{
                            position: "absolute",
                            right: showArrows ? "10px" : "-50px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "transparent",
                            color: "white",
                            zIndex: 2,
                            backdropFilter: "blur(8px)",
                            transition: "right 0.3s ease",
                            "&:hover": {
                                background: "rgba(255, 255, 255, 0.2)",
                                backdropFilter: "blur(12px)",
                            }
                        }}
                        onClick={nextSlide}
                    >
                        <ChevronRight />
                    </IconButton>
                )}
                
                {/* Dots Indicator */}
                <div style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "8px",
                    zIndex: 2
                }}>
                    {items.map((_, index) => (
                        <div
                            key={index}
                            style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: index === currentIndex ? "#a36e29" : "rgba(255,255,255,0.5)",
                                cursor: "pointer"
                            }}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

function Item(props) {
    return (
        // only show the image when fully loaded
        <img
            src={process.env.PUBLIC_URL + `/assets/${props.item.imageName}`}
            alt={props.item.alt}
            style={{
                width: "100%",
                height: "100%",
                borderRadius: "10px",
                cursor: "pointer"
            }}
            onClick={() => props.navigate(props.item.link)}
        />
    )
}