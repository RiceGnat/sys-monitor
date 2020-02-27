import React from "react";

export default ({ gutter, type: Type, data, hash, position, onMove, onDelete }) => 
<div className={gutter ? 'gutter' : 'card'}
    onDragOver={e => {
        if (e.dataTransfer.types.includes('card')) {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'move';
        }
    }}
    onDrop={e => {
        if (e.dataTransfer.types.includes('card')) {
            e.preventDefault();
            e.stopPropagation();
            const card = JSON.parse(e.dataTransfer.getData('card'));
            onMove(card.hash, card.position, position);
        }
    }}
>
    {!gutter &&
        <div className="info dark" draggable="true"
            onDragStart={e => {
                e.stopPropagation();
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('card', JSON.stringify({ hash, position }));
            }}>
            <Type data={data} />
        </div>
    }
</div>
