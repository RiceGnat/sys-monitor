import React, { Fragment } from "react";
import { geebees } from "../util";

export default ({ data }) =>
<Fragment>
    <h5>Memory</h5>
    <table className="h6">
        <tbody>
            <tr>
                <td>Total</td>
                <td>{geebees(data.total, { decimals: 2 })}</td>
            </tr>
            <tr>
                <td>Usage</td>
                <td>{data.usage}%</td>
            </tr>
        </tbody>
    </table>
</Fragment>