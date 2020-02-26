import React from "react";

export default ({ type: Type, data, hash, position, onMove, onDelete }) => 
<div className="card"
    onDragOver={e => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
    }}
    onDrop={e => {
        e.preventDefault();
        if (e.dataTransfer.getData('dragging') === 'card') {
            e.stopPropagation();
            onMove(e.dataTransfer.getData('hash'), JSON.parse(e.dataTransfer.getData('position')), position);
        }
    }}
>
    <div className="info dark" draggable="true"
        onDragStart={e => {
            e.stopPropagation();
            e.dataTransfer.setData('dragging', 'card');
            e.dataTransfer.setData('hash', hash);
            e.dataTransfer.setData('position', JSON.stringify(position));
        }}>
        <Type data={data} />
    </div>
</div>
