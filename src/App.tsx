import React, {useEffect, useRef } from "react";
import axios from "axios";
import useSpotifyAuth from "./hooks/useSpotifyAuth";
import useAudioRecorder from "./hooks/useAudioRecorder"; // Asumimos la ubicación del hook

const App: React.FC = () => {
  const { accessToken, redirectToSpotifyAuth, getAccessToken } =
    useSpotifyAuth();
  const { isRecording, startRecording, stopRecording, audioBlob } =
    useAudioRecorder();
    const audioRef = useRef<HTMLAudioElement>(null);


  useEffect(() => {
    if (accessToken) {
      console.log(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    getAccessToken();
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        console.log("Acceso al micrófono concedido");
      })
      .catch((error) => {
        console.error("Acceso al micrófono denegado", error);
      });
  }, []);

  const handleStartRecording = () => {
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

const sendAudioToServer = async (audioBlob: Blob) => {
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
  }
};


  const playRecordedAudio = () => {
    if (audioBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch((error) => console.error("Error playing the audio:", error));
    }
  };

  const handleSendAudio = async () => {
    if (audioBlob) {
      await sendAudioToServer(audioBlob);
    } else {
      console.log('No hay audio para enviar');
    }
  };
  

  return (
    <div>
      {!accessToken && (
        <button onClick={redirectToSpotifyAuth}>
          Iniciar sesión con Spotify
        </button>
      )}
      <div>
        <button onClick={handleStartRecording} disabled={isRecording}>
          Start Recording
        </button>
        <button onClick={handleStopRecording} disabled={!isRecording}>
          Stop Recording
        </button>
        <button onClick={playRecordedAudio} disabled={!audioBlob}>
          Play Recording
        </button>
        <button onClick={handleSendAudio} disabled={!audioBlob}>Send Audio to Server</button>
        <audio ref={audioRef} controls />
      </div>
    </div>
  );
};

export default App;
