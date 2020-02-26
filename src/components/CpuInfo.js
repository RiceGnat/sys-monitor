import React, { Fragment } from "react";
import { geebees } from "../util";

export default ({ data }) =>
<Fragment>
    <h5>{data.cpus[0].name}</h5>
    <table>
        <tbody>
            {data.cpus.map((cpu, i) =>
                <tr key={i}>
                    <td>Core {i + 1}</td>
                    <td>{geebees(cpu.clock, {
                        decimals: 2,
                        unit: 'Hz',
                        offset: 2,
                        byteMode: false
                    })}</td>
                    <td>{cpu.usage}%</td>
                </tr>
            )}
            <tr className="h6">
                <td colSpan={2}>Overall usage</td>
                <td>{data.overall}%</td>
            </tr>
        </tbody>
    </table>
</Fragment>