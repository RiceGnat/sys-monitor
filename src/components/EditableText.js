import React from "react";

export default ({ className, value, onChange, defaultValue }) => 
<input type="text"
    className={`${className} invisible`}
    value={value}
    onChange={e => onChange(e.target.value)}
    defaultValue={defaultValue}
    // Prevent dragging parent when highlighting
    draggable="true"
    onDragStart={e => {
        e.preventDefault();
        e.stopPropagation();
    }}
/>
