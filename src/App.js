import React, { Fragment } from 'react';
import SensorView from './components/SensorView';
import './App.scss';

function App() {
  return (
    <Fragment>
      <div id="sidebar" className="dark collapsed">
      </div>
      <SensorView endpoints={["http://localhost:8080/sys"]} />
    </Fragment>
  );
}

export default App;
