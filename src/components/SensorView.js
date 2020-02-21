import React, { Component } from "react";
import axios from "axios";
import CardContainer from "./CardContainer";

export default class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: []
        };
    }

    async componentDidMount() {
        const data = (await Promise.all(this.props.endpoints.map(async endpoint => {
            const { data } = await axios.get(endpoint);
            return Object.keys(data).reduce((items, key) => {
                return items.concat((Array.isArray(data[key]) ? data[key] : [data[key]]).map((item, i) => ({
                    type: key,
                    hash: btoa(`${endpoint}/${key}/${i}`),
                    data: item
                })));
            }, []);
        }))).reduce((items, current) => items.concat(current), []);
        this.setState({ data });
    }

    render() {
        return (
            <CardContainer label="Default" data={this.state.data} />
        );
    }
}