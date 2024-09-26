// src/components/InstructionModal.tsx
import React, { useState } from "react";
import "../styles/components/instructionModal.scss";

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const instructions = [
  `Bienvenido a BardBeat! 
Esta aplicación te permite crear una playlist en tu cuenta de Spotify a través de un mensaje de voz.`,
  `Para comenzar, inicia sesión con tu cuenta de Spotify, esto es necesario para poder crear la playlist por ti`,
  "Una vez autenticado, presiona y mantén el botón para comenzar a grabar.",
  "Mantén presionado el botón durante al menos 2 segundos y no más de 8 segundos.",
  "Tu grabación se enviará automáticamente al servidor para su procesamiento.",
  `Ejemplos de uso: 
  - Créame un playlist para salir a correr
  - Haz una playlist de rock de los 2000 para una fiesta en casa
  - Haz una lista para un dia triste en invierno
    `,
  `Si tienes algún problema, asegúrate de que el navegador tenga acceso a tu micrófono.
Disfruta con ello!`,
];

const InstructionModal: React.FC<InstructionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  if (!isOpen) return null;

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) =>
      prev < instructions.length - 1 ? prev + 1 : prev
    );
  };

  const handleClose = () => {
    onClose();
    setCurrentPage(0); // Reiniciar al cerrar
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
        <p id="instruction">{instructions[currentPage]}</p>
        </div>
        <div className="modal-navigation">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            aria-label="Página anterior"
          >
            &#8592;
          </button>
          <span>{`${currentPage + 1} / ${instructions.length}`}</span>
          <button
            onClick={handleNext}
            disabled={currentPage === instructions.length - 1}
            aria-label="Página siguiente"
          >
            &#8594;
          </button>
        </div>
        <button
          id="buttonGotIt"
          style={{
            visibility:
              currentPage === instructions.length - 1 ? "visible" : "hidden",
          }}
          onClick={handleClose}
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default InstructionModal;
