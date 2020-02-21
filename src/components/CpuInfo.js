import React, { Fragment } from "react";

export default ({ data }) =>
<Fragment>
    <h6>CPU</h6>
    <div>Overall usage {data.overall}%</div>
</Fragment>