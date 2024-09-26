// Componente del Modal de Permisos
export const PermissionModal: React.FC<{
    isOpen: boolean;
    onAccept: () => void;
    onDeny: () => void;
  }> = ({ isOpen, onAccept, onDeny }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h2>Permiso para usar el micrófono</h2>
          <p>
            Necesitamos acceder a tu micrófono para recibir tu mensaje y crear la playlist personalizada.
            <br />
            Puedes estar tranquilo(a), tus datos y permisos se eliminarán después de usar el servicio.
          </p>
          <div className="modal-buttons">
            <button onClick={onAccept} className="modal-button accept">
              Aceptar
            </button>
            <button onClick={onDeny} className="modal-button deny">
              Denegar
            </button>
          </div>
        </div>
      </div>
    );
  };