import { useState, useEffect, useRef, RefObject } from 'react';

type UseAudioRecorderReturn = {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => Promise<Blob | null>;
  audioBlob: Blob | null;
  audioRef: RefObject<HTMLAudioElement>;
  setAudioBlob: (blob: Blob | null) => void;
};

const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    // Solicita permisos y configura el MediaRecorder
    const setupMediaRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          setAudioBlob(audioBlob);
          audioChunksRef.current = []; // Limpia los chunks de audio
        };
      } catch (error) {
        console.error('Error setting up media recorder:', error);
      }
    };

    setupMediaRecorder();
  }, []);

  const startRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start();
      setIsRecording(true);
      audioChunksRef.current = []; // Limpia los chunks de audio anteriores
    }
  };

  const stopRecording = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          setAudioBlob(audioBlob);
          resolve(audioBlob);
          audioChunksRef.current = []; // Limpia los chunks de audio
        };
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      } else {
        resolve(null);
      }
    });
  };

  return { isRecording, startRecording, stopRecording, audioBlob, audioRef, setAudioBlob };
};

export default useAudioRecorder;
