import React, { Component } from "react";
import axios from "axios";
import CardContainer from "./CardContainer";

export default class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            layout: []
        };
    }

    async componentDidMount() {
        await this.fetch(true);
    }

    loadLayout = () => {
        
    }

    fetch = async (generateDefaultLayout) => {
        try {
            const layout = [];
            const data = (await Promise.all(this.props.endpoints.map(async (endpoint, index) => {
                const { data } = await axios.get(endpoint);
                const items = Object.keys(data).reduce((items, key) => {
                    return items.concat((Array.isArray(data[key]) ? data[key] : [data[key]]).map((item, i) => ({
                        type: key,
                        hash: btoa(`${index}:${endpoint}/${key}/${i}`),
                        data: item
                    })));
                }, []);
                if (generateDefaultLayout) {
                    layout.push({
                        label: endpoint,
                        items: items.map(({ hash }) => hash)
                    });
                }
                return items;
            }))).reduce((items, current) => items.concat(current), [])
            .reduce((items, current) => {
                items[current.hash] = current;
                return items;
            }, {});

            const newState = { data };
            if (generateDefaultLayout) {
                newState.layout = layout;
            }
            this.setState(newState);
        }
        finally {
            setTimeout(() => this.fetch(false), 1000);
        }
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
        this.setState({ layout });
    }

    moveColumn = (from, to) => {
        const layout = this.state.layout;
        const column = layout[from];
        layout.splice(from, 1);
        layout.splice(to, 0, column);
        this.setState({ layout });
    }

    render = () => 
        <div id="view">
            {this.state.layout.map(({label, items}, i) => 
                <CardContainer
                    key={`column${i}`}
                    label={label}
                    data={items.map(hash => this.state.data[hash])}
                    index={i}
                    onMove={this.moveColumn}
                    onCardMove={this.moveCard}
                />
            )}
            <CardContainer gutter
                index={this.state.layout.length}
                onMove={this.moveColumn}
                onCardMove={this.moveCard} />
        </div>
}