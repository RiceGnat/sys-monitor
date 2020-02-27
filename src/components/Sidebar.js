import React, { Component } from "react";

export default class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: true
        }
    }

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    updateSources = (i, value) => {
        const sources = this.props.config.sources;
        sources[i] = value;
        this.props.onConfigChange('sources', sources);
    }

    render = () => 
    <div id="sidebar" className={`dark${this.state.collapsed ? ' collapsed' : ' '}`}>
        <a className="button expand-button" href="#" onClick={e => {
            e.preventDefault();
            this.toggleCollapsed();
        }}>›</a>
        <div className="panel">
            <h4>Settings</h4>
            <h5>Sources</h5>
                <p>
                {
                    this.props.config.sources.map(({ url }, i) =>
                        <input type="text" key={`sources:${i}`} value={url} onChange={e => this.updateSources(i, { url: e.target.value, initialized: false })} />
                    )
                }
                <input type="button" value="Add source" onClick={e => this.updateSources(this.props.config.sources.length, { url: '', initialized: false })} />
                <br />
                <input type="button" value="Reset layout" />
            </p>
            <h5>View</h5>
            <p>
                Update interval
                &nbsp;
                <select>
                    <option value={100}>100 ms</option>
                    <option value={500}>500 ms</option>
                    <option value={1000}>1 second</option>
                    <option value={5000}>5 seconds</option>
                    <option value={10000}>10 seconds</option>
                </select>
            </p>
            <h5>Data</h5>
            <p>
                <input type="button" value="Import" />
                &nbsp;
                <input type="button" value="Export" />
                <br />
                <input type="button" value="Clear all data" />
            </p>
        </div>
    </div>
}