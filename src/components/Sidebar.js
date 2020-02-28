import React, { Component } from "react";
import DeleteButton from "./DeleteButton";

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
        <div className="panel">
            <h4>Settings</h4>
            <fieldset disabled={this.state.collapsed}>
                <legend>Sources</legend>
                {
                    this.props.config.sources.map(({ url, initialized }, i) =>
                        <div key={`sources:${i}`}>
                            <input type="text" value={url} onChange={e => this.updateSources(i, { url: e.target.value, initialized })} />
                            <DeleteButton />
                        </div>
                    )
                }
                <input type="button" value="Add source" onClick={e => this.updateSources(this.props.config.sources.length, { url: '', initialized: false })} />
                <br />
                <input type="button" value="Reset layout" />
            </fieldset>
            <fieldset>
                <legend>View</legend>
                Update interval
                &nbsp;
                <select onChange={e => this.props.onConfigChange('interval', e.target.value)}>
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