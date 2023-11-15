import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faSquare } from '@fortawesome/free-solid-svg-icons';
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

  useEffect(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = 'ja-JP';

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const recognizedText = event.results[last][0].transcript;
      setTranscript(recognizedText);

      // Send transcript to API
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
  }, [listening]);

  const toggleListening = () => {
    setListening((prev) => !prev);
  };

  const sendToApi = (text: string) => {
    // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint
    const apiEndpoint = 'http://localhost:8000/check-voice';

    // Create a FormData object
    const formData = new FormData();
    formData.append('text', text);

    // Basic fetch example with FormData
    fetch(apiEndpoint, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data);
        setApiResponse(`API Response: ${JSON.stringify(data)}`);
      })
      .catch(error => {
        console.error('Error:', error);
        setApiResponse(`Error: ${error.message}`);
      });
  };

  return (
    <div className="speech-recognition-container">
      <button className="listening-toggle-btn" onClick={toggleListening}>
        {listening ? <FontAwesomeIcon icon={faSquare} style={{color: "#f46a48",}} /> : <FontAwesomeIcon icon={faMicrophone} style={{color: "#144599",}} />}
      </button>
      <div className="transcript-container">
        <p className="transcript-text">{transcript}</p>
        {/* <p className="api-response-text">{apiResponse}</p> */}
      </div>
    </div>
  );
};

export default SpeechRecognitionComponent;
