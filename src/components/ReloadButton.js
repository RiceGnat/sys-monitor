import React from "react";

export default ({ onClick }) =>
<button type="button" className="link-button reload-button no-outline"
    onClick={e => {
        e.preventDefault();
        onClick(e);
    }}>
    <span>&#128259;</span>
</button>
