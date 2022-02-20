import React from 'react';
import SVGEditor from './components/SVGEditor/SVGEditor';
import Background from './assets/background.jpg';

function App() {
  return (
    <div style={{position: 'relative'}}>
      <SVGEditor width={400} height={379} />

      <div style={{zIndex: -1, position: 'absolute', top: 0, left: 0}}>
        <img src={Background} />
      </div>
    </div>
  );
}

export default App;
