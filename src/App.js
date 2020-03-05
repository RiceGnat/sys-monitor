import React, { Component, Fragment } from 'react';
import SensorView from './components/SensorView';
import Sidebar from './components/Sidebar';
import './App.scss';

const defaultState = {
  sources: [
    {
      url: 'http://localhost:8080/sys',
      initialized: false
    }
  ],
  layout: [],
  updateInterval: 1000
};

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {
    const state = localStorage.getItem('state');
    if (state) {
      this.setState(JSON.parse(state));
    }
    else {
      this.setState(defaultState);
    }
  }

  saveState = state => this.setState(state, () => localStorage.setItem('state', JSON.stringify(this.state)));

  resetState = () => this.setState(defaultState, () => localStorage.removeItem('state'));

  updateConfig = (key, value) => {
    if (typeof key === 'object') {
      this.saveState(key);
    }
    else {
      const state = this.state;
      state[key] = value;
      this.saveState(state);
    }
  }

  initializeSource = index => {
    const state = this.state;
    state.sources[index].initialized = true;
    this.saveState(state);
  }

  render = () => this.state.sources ?
  <Fragment>
    <Sidebar config={this.state} onConfigChange={this.updateConfig} onReset={this.resetState} />
    <SensorView
      sources={this.state.sources.filter(({ url }) => url)}
      onSourceInitialized={this.initializeSource}
      layout={this.state.layout}
      onLayoutChanged={layout => this.updateConfig('layout', layout)}
      updateInterval={this.state.updateInterval} />
  </Fragment>
  : null;
}
