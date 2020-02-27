import React, { Fragment } from "react";
import EditableText from "./EditableText";
import { geebees } from "../util";

export default ({ data, overrides, onEdit }) =>
<Fragment>
    <EditableText className="h5"
        defaultValue={`${data.name} (${data.label})`}
        value={overrides.name}
        onChange={value => onEdit('name', value)} />
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