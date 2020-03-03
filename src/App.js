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
      ],
      layout: [],
      updateInterval: 1000
    }
  }

  updateConfig = (key, value) => {
    if (typeof key === 'object') {
      this.setState(key);
    }
    else {
      const state = this.state;
      state[key] = value;
      this.setState(state);
    }
  }

  initializeSource = index => {
    const state = this.state;
    state.sources[index].initialized = true;
    this.setState(state);
  }

  render = () =>
  <Fragment>
    <Sidebar config={this.state} onConfigChange={this.updateConfig} />
    <SensorView
      sources={this.state.sources.filter(({ url }) => url)}
      onSourceInitialized={this.initializeSource}
      layout={this.state.layout}
      onLayoutChanged={layout => this.updateConfig('layout', layout)}
      updateInterval={this.state.updateInterval} />
  </Fragment>
}
