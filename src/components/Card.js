import React from "react";
import DeleteButton from "./DeleteButton";

export default ({ gutter, type: Type, data, overrides, hash, position, onMove, onEdit, onDelete, dark }) => 
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
        <div className={`info${dark ? " dark" : ""}`} draggable="true"
            onDragStart={e => {
                e.stopPropagation();
                e.dataTransfer.effectAllowed = 'copyMove';
                e.dataTransfer.setData('card', JSON.stringify({ hash, position }));
            }}>
            <Type data={data} overrides={overrides} onEdit={(key, value) => onEdit(hash, key, value)} />
            <DeleteButton onClick={() => onDelete(position)} />
        </div>
    }
</div>
