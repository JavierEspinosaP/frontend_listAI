import React from "react";
import '../styles/components/button.scss'; // Asegúrate de que tu archivo SASS esté correctamente vinculado

interface ButtonProps {
  onMouseDown: () => void;
  onMouseUp: () => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
  className: string;
}

const RecordButton: React.FC<ButtonProps> = ({
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
  className,
}) => {
  return (
    <div
      className={`button-container ${className}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button className="button">
        <div className="button__content">
          <div className="button__icon"></div>
          <p className="button__text">Press to record</p>
        </div>
      </button>
    </div>
  );
};

export default RecordButton;
