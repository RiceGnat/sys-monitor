import React from "react";

export default ({ onClick }) =>
<button type="button" className="link-button delete-button no-outline"
    onClick={e => {
        e.preventDefault();
        onClick(e);
    }}>
    <span>&times;</span>
</button>
