// App.tsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import useSpotifyAuth from "./hooks/useSpotifyAuth";
import useAudioRecorder from "./hooks/useAudioRecorder";
import "./styles/components/button.scss";
import "./styles/pages/app.scss";
import Button from "./components/button";
import pressSoundFile from "/sounds/press.wav";
import releaseSoundFile from "/sounds/release.wav";
import Counter from "./components/counter";
import axios from 'axios';

// Componente para mostrar mensajes personalizados
const Message: React.FC<{ message: string }> = ({ message }) => (
  <div className="message">
    {message}
  </div>
);

// Componente del Modal de Permisos
const PermissionModal: React.FC<{
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

const App: React.FC = () => {
  const { accessToken, redirectToSpotifyAuth } = useSpotifyAuth();
  const { isRecording, startRecording, stopRecording, audioBlob, setAudioBlob } = useAudioRecorder();
  
  const [showCounter, setShowCounter] = useState<boolean>(false);
  const [showFinalMessage, setShowFinalMessage] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [lastPressTime, setLastPressTime] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState<boolean>(false);

  const pressSound = useRef<HTMLAudioElement>(new Audio(pressSoundFile));
  const releaseSound = useRef<HTMLAudioElement>(new Audio(releaseSoundFile));
  const pressStartTime = useRef<number | null>(null);

  useEffect(() => {
    // Verificar el estado del permiso del micrófono al montar el componente
    const checkMicrophonePermission = async () => {
      if (!navigator.permissions) {
        // Si la API de permisos no está disponible, asumimos que no tenemos permiso
        setHasMicrophonePermission(false);
        return;
      }

      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permissionStatus.state === 'granted') {
          setHasMicrophonePermission(true);
        } else if (permissionStatus.state === 'prompt') {
          setHasMicrophonePermission(false);
        } else {
          setHasMicrophonePermission(false);
        }

        // Escuchar cambios en el estado del permiso
        permissionStatus.onchange = () => {
          if (permissionStatus.state === 'granted') {
            setHasMicrophonePermission(true);
          } else {
            setHasMicrophonePermission(false);
          }
        };
      } catch (error) {
        console.error("Error al verificar permisos de micrófono:", error);
        setHasMicrophonePermission(false);
      }
    };

    checkMicrophonePermission();
  }, []);

  useEffect(() => {
    if (audioBlob && !isSending) { 
      sendAudioToServer(audioBlob);
      setShowFinalMessage(true);  

      const timeout = setTimeout(() => {
        resetState();
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [audioBlob, isSending]);

  const resetState = () => {
    setShowCounter(false); 
    setShowFinalMessage(false); 
    setAudioBlob(null);
    setIsSending(false);
  };

  const sendAudioToServer = async (blob: Blob) => {
    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'audio.webm');

      const response = await axios.post('https://backend-listai.onrender.com/upload-audio', formData, {
        headers: {
          authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      console.error('Error al enviar el audio al servidor:', error);
      setErrorMessage("Error al enviar el audio. Por favor, intenta de nuevo.");
      setIsSending(false);
    }
  };

  const handleAcceptPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicrophonePermission(true);
      setShowPermissionModal(false);
      // Detener todas las pistas para liberar el micrófono
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error("Permiso de micrófono denegado:", error);
      setErrorMessage("No se pudo acceder al micrófono. Por favor, permite el acceso para usar esta función.");
      setShowPermissionModal(false);
    }
  };

  const handleDenyPermission = () => {
    setErrorMessage("No se puede grabar sin acceso al micrófono.");
    setShowPermissionModal(false);
  };

  const handlePress = useCallback(() => {
    const now = Date.now();

    if (now - lastPressTime < 1000) {
      setErrorMessage("No puedes pulsar el botón más de una vez por segundo");
      setShowCounter(false);
      setShowFinalMessage(false);
      return;
    }

    setLastPressTime(now);
    pressStartTime.current = now;

    if (!isRecording) {
      if (hasMicrophonePermission) {
        startRecording();
        pressSound.current.play();
        setShowCounter(true);
        setShowFinalMessage(false);
      } else {
        setShowPermissionModal(true);
      }
    }
  }, [lastPressTime, isRecording, startRecording, hasMicrophonePermission]);

  const handleRelease = useCallback(async () => {
    const now = Date.now();

    if (pressStartTime.current) {
      const duration = (now - pressStartTime.current) / 1000;

      if (duration < 2) {
        setErrorMessage("Debes mantener el botón pulsado al menos 2 segundos");
        resetState();
        return;
      }

      if (duration > 8) {
        setErrorMessage("No puedes mantener el botón pulsado más de 8 segundos");
        resetState();
        return;
      }

      if (isRecording) {
        try {
          const stoppedBlob = await stopRecording();
          releaseSound.current.play();
          setShowFinalMessage(true);
          if (stoppedBlob) {
            setAudioBlob(stoppedBlob);
          }
        } catch (error) {
          console.error("Error al detener la grabación:", error);
          setErrorMessage("Error al detener la grabación. Por favor, intenta de nuevo.");
        }
      }
    }
    pressStartTime.current = null;
  }, [isRecording, stopRecording]);

  const handleEndMessageDisplay = () => {
    setShowCounter(false);
    setShowFinalMessage(false); 
  };

  return (
    <section className="wrapper">
      <div className="hero"></div>
      <div className="content">
        {errorMessage && <Message message={errorMessage} />}
        {showCounter && (
          <Counter 
            onComplete={handleRelease} 
            onEnd={handleEndMessageDisplay} 
            showFinalMessage={showFinalMessage} 
          />
        )}
        <h1 className="h1--scalingSize" data-text="An awesome title">
          BardBeat
        </h1>
        {!accessToken ? (
          <button 
            onClick={redirectToSpotifyAuth} 
            className="login-button"
            aria-label="Iniciar sesión con Spotify"
          >
            Iniciar sesión con Spotify
          </button>
        ) : (
          <Button
            onTouchStart={handlePress}
            onTouchEnd={handleRelease}
            onMouseDown={handlePress}
            onMouseUp={handleRelease}
            className={isRecording ? "pressed" : ""}
            aria-label={isRecording ? "Grabando" : "Presiona para grabar"}
          />
        )}
      </div>

      {/* Modal de Permisos */}
      <PermissionModal
        isOpen={showPermissionModal}
        onAccept={handleAcceptPermission}
        onDeny={handleDenyPermission}
      />
    </section>
  );
};

export default App;
