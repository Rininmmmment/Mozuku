import React from 'react';
import WebcamCapture from './WebcamCapture'; // WebcamCaptureコンポーネントが定義されたファイルへのインポート
import ThreeDModel from './ShachiObject'; // ThreeDObjectコンポーネントが定義されたファイルへのインポート

function App() {
  return (
    
    <div>
      <WebcamCapture /> {/* WebcamCaptureコンポーネントを表示 */}
      {/* <ThreeDModel animation = { 0 } /> */}
    </div>
  );
}

export default App;
