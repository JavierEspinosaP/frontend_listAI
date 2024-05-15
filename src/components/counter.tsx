import React, { useEffect, useState } from 'react';

interface CounterProps {
  onComplete: () => void;
  onEnd: () => void;
  showFinalMessage: boolean;  // Property to control showing the final message
}

const Counter: React.FC<CounterProps> = ({ onComplete, onEnd, showFinalMessage }) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    let countdownTimer: number;  // Changed from NodeJS.Timeout to number
    let messageTimer: number;    // Changed from NodeJS.Timeout to number

    if (showFinalMessage) {
      setShowMessage(true);
      messageTimer = window.setTimeout(() => {  // Explicitly using window.setTimeout for clarity
        onEnd();
        setShowMessage(false);  // Ensure the message is hidden after being shown
      }, 2000);  // Displays the message for 2 seconds
    } else {
      countdownTimer = window.setTimeout(() => {
        onComplete();
        setShowMessage(true);
        messageTimer = window.setTimeout(() => {
          onEnd();
          setShowMessage(false);
        }, 2000);
      }, 5000);
    }

    return () => {
      clearTimeout(countdownTimer);
      clearTimeout(messageTimer);
    };
  }, [onComplete, onEnd, showFinalMessage]);

  return (
    <div className="counter-container">
      {showMessage ? (
        <span className="counter-span message">AUDIO ENVIADO</span>
      ) : (
        Array.from({ length: 6 }).map((_, index) => (
          <span key={index} className="counter-span" style={{ animationDelay: `${index}s` }}>
            {5 - index}
          </span>
        ))
      )}
    </div>
  );
};

export default Counter;
