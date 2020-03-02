import React, { Component } from "react";
import axios from "axios";
import CardContainer from "./CardContainer";

export default class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            layout: [],
            userOverrides: {}
        };
    }

    async componentDidMount() {
        await this.fetch(true);
    }

    loadLayout = () => {
        
    }

    updateLayout = (layout, others) => {
        this.setState(others ? { layout, ...others } : { layout });
    }

    fetch = async () => {
        const newColumns = [];
        const data = (await Promise.all(this.props.sources.map(async ({ url, initialized }, index) => {
            try {
                const { data: response } = await axios.get(url);
                const items = response.map(({ type, data }, i) => ({
                    type,
                    hash: btoa(`${url}/${i}`),
                    data
                }));
                if (!initialized) {
                    newColumns.push({
                        label: url.replace(/https?:\/\//, ''),
                        items: items.map(({ hash }) => hash)
                    });
                    this.props.onSourceInitialized(index);
                }
                return items;
            }
            catch {
                return [];
            }
        }))).reduce((items, current) => items.concat(current), [])
        .reduce((data, current) => {
            data[current.hash] = current;
            return data;
        }, {});

        this.updateLayout(this.state.layout.concat(newColumns), { data });
        setTimeout(() => this.fetch(false), this.props.updateInterval);
    }

    moveColumn = (from, to) => {
        const layout = this.state.layout;
        const column = layout[from];
        layout.splice(from, 1);
        layout.splice(to, 0, column);
        this.updateLayout(layout);
    }

    editColumn = (index, key, value) => {
        const layout = this.state.layout;
        layout[index][key] = value;
        this.updateLayout(layout);
    }

    deleteColumn = index => {
        const layout = this.state.layout;
        layout.splice(index, 1);
        this.updateLayout(layout);
    }

    moveCard = (hash, from, to) => {
        const layout = this.state.layout;
        layout[from.column].items.splice(from.offset, 1);
        if (to.column >= layout.length) {
            layout[to.column] = {
                label: 'New Column',
                items: []
            };
        }
        layout[to.column].items.splice(to.offset, 0, hash);
        this.updateLayout(layout);
    }

    editCard = (hash, key, value) => {
        const userOverrides = this.state.userOverrides;
        if (!userOverrides[hash]) {
            userOverrides[hash] = {};
        }
        userOverrides[hash][key] = value;
        this.setState({ userOverrides });
    }

    deleteCard = position => {
        const layout = this.state.layout;
        layout[position.column].items.splice(position.offset, 1);
        this.updateLayout(layout);
    }

    render = () => 
        <div id="view">
            {this.state.layout.map(({label, items}, i) => 
                <CardContainer
                    key={`column${i}`}
                    label={label}
                    data={items.filter(hash => this.state.data[hash])
                        .map(hash => ({
                            ...this.state.data[hash],
                            userOverrides: this.state.userOverrides[hash] || {}
                        }))}
                    index={i}
                    onMove={this.moveColumn}
                    onEdit={this.editColumn}
                    onDelete={this.deleteColumn}
                    onCardMove={this.moveCard}
                    onCardEdit={this.editCard}
                    onCardDelete={this.deleteCard}
                />
            )}
            <CardContainer gutter
                index={this.state.layout.length}
                onMove={this.moveColumn}
                onCardMove={this.moveCard} />
        </div>
}