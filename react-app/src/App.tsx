import React from 'react';
import WebcamCapture from './WebcamCapture'; // WebcamCaptureコンポーネントが定義されたファイルへのインポート
import ThreeDModel from './ShachiObject'; // ThreeDObjectコンポーネントが定義されたファイルへのインポート

function App() {
  return (
    
    <div>
      <WebcamCapture /> {/* WebcamCaptureコンポーネントを表示 */}
      <ThreeDModel />
    </div>
  );
}

export default App;
