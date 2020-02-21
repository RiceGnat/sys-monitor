import React from 'react';
import SensorView from './components/SensorView';
import './App.css';

function App() {
  return (
    <div>
      <div id="sidebar" className="dark collapsed">
      </div>
      <div id="view">
        <SensorView endpoints={["http://localhost:8080/sys"]} />
      </div>
    </div>
  );
}

export default App;
