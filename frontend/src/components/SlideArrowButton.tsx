import React from "react";
import { ArrowRight } from "lucide-react";
import './SlideArrowButton.css';

interface SlideArrowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  primaryColor?: string;
}

export default function SlideArrowButton({
  text = "Get Started",
  primaryColor = "#6f3cff",
  className = "",
  ...props
}: SlideArrowButtonProps) {
  return (
    <button
      className={`slide-arrow-button ${className}`}
      {...props}
    >
      <div
        className="slide-arrow-button__bg"
        style={{ backgroundColor: primaryColor }}
      >
        <span className="slide-arrow-button__icon">
          <ArrowRight size={20} />
        </span>
      </div>
      <span className="slide-arrow-button__text">
        {text}
      </span>
    </button>
  );
}
