import React from 'react';
import WebcamCapture from './WebcamCapture'; // WebcamCaptureコンポーネントが定義されたファイルへのインポート
import SpeechRecognitionComponent from './VoiceInput'
function App() {
  return (
    
    <div>
      <WebcamCapture /> {/* WebcamCaptureコンポーネントを表示 */}
      <SpeechRecognitionComponent />
    </div>
  );
}

export default App;
