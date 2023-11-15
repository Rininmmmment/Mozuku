import React from 'react';
import WebcamCapture from './WebcamCapture';
import SpeechRecognitionComponent from './VoiceInput'
import Navbar from './Navbar';

function App() {
  return (
    <div>
      <Navbar />
      <WebcamCapture />
      <SpeechRecognitionComponent />
    </div>
  );
}

export default App;
