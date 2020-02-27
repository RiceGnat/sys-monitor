import React, { Component, Fragment } from 'react';
import SensorView from './components/SensorView';
import Sidebar from './components/Sidebar';
import './App.scss';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sources: [
        {
          url: "http://localhost:8080/sys",
          initialized: false
        }
      ]
    }
  }

  updateConfig = (key, value) => {
    const state = this.state;
    state[key] = value;
    this.setState(state);
  }

  initializeSource = index => {
    const state = this.state;
    state.sources[index].initialized = true;
    this.setState(state);
  }

  render = () =>
  <Fragment>
    <Sidebar config={this.state} onConfigChange={this.updateConfig} />
    <SensorView sources={this.state.sources.filter(({ url }) => url)} onSourceInitialized={this.initializeSource} />
  </Fragment>
}
