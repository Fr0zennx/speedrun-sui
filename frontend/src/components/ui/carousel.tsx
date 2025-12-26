import { useState, useEffect, useCallback } from 'react';
import './carousel.css';

export interface SlideData {
  title: string;
  button: string;
  src: string;
  onClick?: () => void;
}

interface CarouselProps {
  slides: SlideData[];
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

function Slide({ slide, index, current, handleSlideClick }: SlideProps) {
  const isActive = index === current;
  const offset = index - current;

  return (
    <div
      className={`carousel-slide ${isActive ? 'active' : ''} ${offset < 0 ? 'prev' : offset > 0 ? 'next' : ''}`}
      style={{
        transform: `translateX(${offset * 100}%) scale(${isActive ? 1 : 0.8})`,
        opacity: Math.abs(offset) > 1 ? 0 : 1,
        zIndex: isActive ? 10 : Math.max(0, 10 - Math.abs(offset))
      }}
      onClick={() => handleSlideClick(index)}
    >
      <div className="carousel-slide-image">
        <img src={slide.src} alt={slide.title} />
        <div className="carousel-slide-overlay" />
      </div>
      <div className="carousel-slide-content">
        <h2 className="carousel-slide-title">{slide.title}</h2>
        <button
          className="carousel-slide-button"
          onClick={(e) => {
            e.stopPropagation();
            slide.onClick?.();
          }}
        >
          {slide.button}
        </button>
      </div>
    </div>
  );
}

function CarouselControl({ type, title, handleClick }: CarouselControlProps) {
  return (
    <button
      className={`carousel-control carousel-control-${type}`}
      onClick={handleClick}
      aria-label={title}
      title={title}
    >
      {type === 'previous' ? '‹' : '›'}
    </button>
  );
}

export default function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const handlePrevious = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const handleSlideClick = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handlePrevious, handleNext]);

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <div className="carousel-track">
          {slides.map((slide, index) => (
            <Slide
              key={index}
              slide={slide}
              index={index}
              current={current}
              handleSlideClick={handleSlideClick}
            />
          ))}
        </div>

        <CarouselControl
          type="previous"
          title="Previous slide"
          handleClick={handlePrevious}
        />
        <CarouselControl
          type="next"
          title="Next slide"
          handleClick={handleNext}
        />
      </div>

      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`carousel-indicator ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
