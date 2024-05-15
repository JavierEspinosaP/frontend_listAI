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
  const [isSending, setIsSending] = useState<boolean>(false); // Nuevo estado
  const pressSound = useRef<HTMLAudioElement>(new Audio(press));
  const releaseSound = useRef<HTMLAudioElement>(new Audio(release));
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (audioBlob && !isSending) { // Verificar si no está en curso el envío
      const newBlobUrl = URL.createObjectURL(audioBlob);
      setBlobUrl(newBlobUrl); // Update state with the new Blob URL
      sendAudioToServer(audioBlob);
      setShowFinalMessage(true);  // Ensure the final message is shown after sending the audio

      setTimeout(() => {
        setShowCounter(false);  // Hide the counter after the message has been displayed
        setShowFinalMessage(false);  // Ensure message is hidden again
        if (newBlobUrl) { // Check if newBlobUrl is not null before revoking
          URL.revokeObjectURL(newBlobUrl);  // Clean up the Blob URL
        }
        setAudioBlob(null);
        setBlobUrl(null);  // Reset blobUrl in state
        setIsSending(false);  // Reset sending state
      }, 2000);
    }
  }, [audioBlob, setAudioBlob, isSending]);

  const sendAudioToServer = async (audioBlob: Blob) => {
    setIsSending(true); // Marcar que el envío está en curso
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
  
      const response = await axios.post('https://backend-listai.onrender.com/upload-audio', formData, {
        headers: {
          authorization: 'Bearer ' + accessToken
        },
      });
  
      // Maneja la respuesta del servidor
      console.log('Respuesta del servidor:', response.data);
      // Aquí podrías actualizar el estado de tu componente con la respuesta,
      // por ejemplo, mostrando la transcripción del audio.
    } catch (error) {
      console.error('Error al enviar el audio al servidor:', error);
      setIsSending(false); // Reset sending state on error
    }
  };

  const handlePress = () => {
    if (!isRecording) {
      startRecording();
      pressSound.current.play();
      setShowCounter(true);
      setShowFinalMessage(false);  // Reset message visibility
    }
  };

  const handleRelease = async () => {
    if (isRecording) {
      const stoppedBlob = await stopRecording();
      releaseSound.current.play();
      setShowFinalMessage(true);  // Show final message on release
      if (stoppedBlob) {
        sendAudioToServer(stoppedBlob);
        setAudioBlob(stoppedBlob);  // Update state with the new Blob
      }

      setTimeout(() => {
        setShowCounter(false);  // Hide the counter after the message has been displayed
        setShowFinalMessage(false);  // Ensure message is hidden again
      }, 2000);
    }
  };

  const endMessageDisplay = () => {
    setShowCounter(false);
    setShowFinalMessage(false);  // Ensure message is hidden after timeout
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
