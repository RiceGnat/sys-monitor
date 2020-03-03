import React, { Component } from "react";
import DeleteButton from "./DeleteButton";
import ReloadButton from "./ReloadButton";

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
        if (value) sources[i] = value;
        else sources.splice(i, 1);
        if (sources.length === 0) sources[0] = { url: '', initialized: false };
        this.props.onConfigChange('sources', sources);
    }

    render = () => 
    <div id="sidebar" className={`dark${this.state.collapsed ? ' collapsed' : ' '}`}>
        <div className="panel">
            <h4>Settings</h4>
            <fieldset disabled={this.state.collapsed}>
                <legend>Sources</legend>
                {
                    this.props.config.sources.map(({ url, initialized }, i) =>
                        <div key={`sources:${i}`} className="source">
                            <input type="text" value={url} onChange={e => this.updateSources(i, { url: e.target.value, initialized })} />
                            <ReloadButton onClick={() => this.updateSources(i, { url, initialized: false })} />
                            <DeleteButton onClick={() => this.updateSources(i)} />
                        </div>
                    )
                }
                <input type="button" value="Add source" onClick={() => this.updateSources(this.props.config.sources.length, { url: '', initialized: false })} />
                <br />
                <input type="button" value="Reset layout" onClick={() => this.props.onConfigChange({
                    layout: [],
                    sources: this.props.config.sources.map(({ url }) => ({ url, initialized: false }))
                })} />
            </fieldset>
            <fieldset>
                <legend>View</legend>
                Update interval
                &nbsp;
                <select value={this.props.config.updateInterval} onChange={e => this.props.onConfigChange('updateInterval', e.target.value)}>
                    <option value={100}>100 ms</option>
                    <option value={500}>500 ms</option>
                    <option value={1000}>1 second</option>
                    <option value={5000}>5 seconds</option>
                    <option value={10000}>10 seconds</option>
                </select>
            </fieldset>
            <fieldset>
                <legend>Data</legend>
                <input type="button" value="Import" />
                &nbsp;
                <input type="button" value="Export" />
                <br />
                <input type="button" value="Clear all data" />
            </fieldset>
        </div>
        <button type="button" className="expand-button no-outline"
            onClick={e => {
                e.preventDefault();
                this.toggleCollapsed();
            }}>
            <span>&lsaquo;</span>
        </button>
    </div>
}