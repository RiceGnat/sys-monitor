import React from "react";

export default ({ onClick }) =>
<button type="button" className="link-button reload-button no-outline"
    onClick={e => {
        e.preventDefault();
        onClick(e);
    }}>
    <span role="img" aria-label="reload">&#8635;</span>
</button>
