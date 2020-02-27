import React from "react";

export default ({ onClick }) =>
// eslint-disable-next-line
<a className="button delete-button" href="#" onClick={e => {
    e.preventDefault();
    onClick(e);
}}>×</a>
