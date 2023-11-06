import React from 'react';
import WebcamCapture from './WebcamCapture'; // WebcamCaptureコンポーネントが定義されたファイルへのインポート
import ThreeDObject from './ThreeDObject'; // ThreeDObjectコンポーネントが定義されたファイルへのインポート

function App() {
  return (
    <div>
      <WebcamCapture /> {/* WebcamCaptureコンポーネントを表示 */}
      <ThreeDObject /> {/* ThreeDObjectコンポーネントを表示 */}
    </div>
  );
}

export default App;
