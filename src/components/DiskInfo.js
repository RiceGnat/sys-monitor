import React, { Fragment } from "react";
import { geebees } from "../util";

export default ({ data }) =>
<Fragment>
    <h5>{data.name} ({data.label})</h5>
    <table className="h6">
        <tbody>
            <tr>
                <td>Size</td>
                <td>{geebees(data.size, { decimals: 2 })}</td>
            </tr>
            <tr>
                <td>Usage</td>
                <td>{data.usage}%</td>
            </tr>
        </tbody>
    </table>
</Fragment>