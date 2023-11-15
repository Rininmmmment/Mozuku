import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faSquare } from '@fortawesome/free-solid-svg-icons';
import { Howl } from 'howler';
import './styles/voice-input.css';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const SpeechRecognitionComponent = () => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [playSound, setPlaySound] = useState(false);

  useEffect(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = 'ja-JP';

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const recognizedText = event.results[last][0].transcript;
      setTranscript(recognizedText);
      sendToApi(recognizedText);
    };

    if (listening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [listening, playSound]);

  const toggleListening = () => {
    setListening((prev) => !prev);
  };

  const sendToApi = (text: string) => {
    const apiEndpoint = 'http://localhost:8000/check-voice';
    const formData = new FormData();
    formData.append('text', text);

    fetch(apiEndpoint, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data);
        setApiResponse(`API Response: ${JSON.stringify(data)}`);

        if (data.response === 'mozuku') {
          setTimeout(() => setPlaySound(true), 1000);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setApiResponse(`Error: ${error.message}`);
      });
  };

  useEffect(() => {
    if (playSound) {
      playAudio();
      setPlaySound(false);
    }
  }, [playSound]);

  const playAudio = () => {
    const sound = new Howl({
      src: ['./short.mp3'],
    });

    sound.play();
  };

  return (
    <div className="speech-recognition-container">
      <button className="listening-toggle-btn" onClick={toggleListening}>
        {listening ? <FontAwesomeIcon icon={faSquare} style={{ color: "#f46a48" }} /> : <FontAwesomeIcon icon={faMicrophone} style={{ color: "#144599" }} />}
      </button>
      <div className="transcript-container">
        <p className="transcript-text">{transcript}</p>
      </div>
    </div>
  );
};

export default SpeechRecognitionComponent;
