import React, { useEffect, useState, useRef } from "react";
import useSpotifyAuth from "./hooks/useSpotifyAuth";
import useAudioRecorder from "./hooks/useAudioRecorder";
import "./styles/components/button.scss";
import "./styles/pages/app.scss";
import Button from "./components/button";
import press from "/sounds/press.wav";
import release from "/sounds/release.wav";
import Counter from "./components/counter";
import axios from 'axios';

const App: React.FC = () => {
  const { accessToken, redirectToSpotifyAuth } = useSpotifyAuth();
  const { isRecording, startRecording, stopRecording, audioBlob, setAudioBlob } = useAudioRecorder();
  const [showCounter, setShowCounter] = useState<boolean>(false);
  const [showFinalMessage, setShowFinalMessage] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false); 
  const [lastPressTime, setLastPressTime] = useState<number>(0); // Para medir el tiempo entre pulsaciones
  const pressSound = useRef<HTMLAudioElement>(new Audio(press));
  const releaseSound = useRef<HTMLAudioElement>(new Audio(release));
  const pressStartTime = useRef<number | null>(null);

  useEffect(() => {
    if (audioBlob && !isSending) { 
      const newBlobUrl = URL.createObjectURL(audioBlob);
      sendAudioToServer(audioBlob);
      setShowFinalMessage(true);  

      setTimeout(() => {
        setShowCounter(false); 
        setShowFinalMessage(false); 
        if (newBlobUrl) { 
          URL.revokeObjectURL(newBlobUrl); 
        }
        setAudioBlob(null);
        setIsSending(false); 
      }, 2000);
    }
  }, [audioBlob, setAudioBlob, isSending]);

  const sendAudioToServer = async (audioBlob: Blob) => {
    setIsSending(true); 
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
  
      const response = await axios.post('https://backend-listai.onrender.com/upload-audio', formData, {
        headers: {
          authorization: 'Bearer ' + accessToken
        },
      });
  
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      console.error('Error al enviar el audio al servidor:', error);
      setIsSending(false); 
    }
  };

  const handlePress = () => {
    const now = Date.now();

    // Si el botón se pulsa más de una vez en menos de un segundo, alerta
    if (now - lastPressTime < 1000) {
      alert("No puedes pulsar el botón más de una vez por segundo");
      return;
    }
    
    setLastPressTime(now); // Actualiza el tiempo de la última pulsación

    pressStartTime.current = now; // Inicia el cronómetro para la duración del press
    if (!isRecording) {
      startRecording();
      pressSound.current.play();
      setShowCounter(true);
      setShowFinalMessage(false); 
    }
  };

  const handleRelease = async () => {
    const now = Date.now();

    if (pressStartTime.current) {
      const duration = (now - pressStartTime.current) / 1000; // Duración en segundos

      // Si el botón se suelta antes de los 2 segundos, alerta
      if (duration < 2) {
        alert("Debes mantener el botón pulsado al menos 2 segundos");
        return;
      }

      // Si el botón se suelta después de 8 segundos, no enviamos nada
      if (duration > 8) {
        alert("No puedes mantener el botón pulsado más de 8 segundos");
        return;
      }

      if (isRecording) {
        const stoppedBlob = await stopRecording();
        releaseSound.current.play();
        setShowFinalMessage(true); 
        if (stoppedBlob) {
          sendAudioToServer(stoppedBlob);
          setAudioBlob(stoppedBlob);  
        }

        setTimeout(() => {
          setShowCounter(false); 
          setShowFinalMessage(false); 
        }, 2000);
      }
    }
    pressStartTime.current = null; // Reinicia el cronómetro
  };

  const endMessageDisplay = () => {
    setShowCounter(false);
    setShowFinalMessage(false); 
  };

  return (
    <section className="wrapper">
      <div className="hero"></div>
      <div className="content">
        {showCounter && <Counter onComplete={handleRelease} onEnd={endMessageDisplay} showFinalMessage={showFinalMessage} />}
        <h1 className="h1--scalingSize" data-text="An awesome title">
          BardBeat
        </h1>
        {!accessToken ? (
          <button onClick={redirectToSpotifyAuth}>
            Iniciar sesión con Spotify
          </button>
        ) : (
          <Button
            onMouseDown={handlePress}
            onMouseUp={handleRelease}
            onTouchStart={handlePress}
            onTouchEnd={handleRelease}
            className={isRecording ? "pressed" : ""}
          />
        )}
      </div>
    </section>
  );
};

export default App;
