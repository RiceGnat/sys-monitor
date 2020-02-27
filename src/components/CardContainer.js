import React, { Fragment } from "react";
import Card from "./Card";
import CpuInfo from "./CpuInfo";
import MemInfo from "./MemInfo";
import DiskInfo from "./DiskInfo";
import EditableText from "./EditableText";
import DeleteButton from "./DeleteButton";

const tileTypeMap = {
    cpu: CpuInfo,
    memory: MemInfo,
    disk: DiskInfo
};

export default ({ gutter, label, data, index, onMove, onEdit, onDelete, onCardMove, onCardEdit, onCardDelete }) => 
<div className={gutter ? 'gutter' : 'column'} draggable={!gutter}
    onDragOver={e => {
        if (e.dataTransfer.types.includes('column') ||
            (gutter && e.dataTransfer.types.includes('card'))) {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'move';
        }
    }}
    onDrop={e => {
        if (e.dataTransfer.types.includes('column')) {
            e.preventDefault();
            e.stopPropagation();
            const column = JSON.parse(e.dataTransfer.getData('column'));
            onMove(column.position, index);
        }
        else if (e.dataTransfer.types.includes('card')) {
            e.preventDefault();
            e.stopPropagation();
            const card = JSON.parse(e.dataTransfer.getData('card'));
            onCardMove(card.hash, card.position, { column: index, offset: 0 });
        }
    }}
    onDragStart={e => {
        e.stopPropagation();
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('column', JSON.stringify({ position: index }));
    }}>
    {!gutter &&
        <Fragment>
            <header>
                <EditableText className="h4" value={label} onChange={value => onEdit(index, 'label', value)} />
                <DeleteButton onClick={() => onDelete(index)} />
            </header>
            <div className="card-container">
                {data.map((item, i) => <Card
                    key={btoa(`${index}:${i}:${item.hash}`)}
                    type={tileTypeMap[item.type]}
                    data={item.data}
                    overrides={item.userOverrides}
                    position={{ column: index, offset: i}}
                    hash={item.hash}
                    onMove={(hash, from, to) => onCardMove(hash, from, to)}
                    onEdit={(hash, key, value) => onCardEdit(hash, key, value)}
                    onDelete={position => onCardDelete(position)}
                />)}
                <Card gutter
                    position={{ column: index, offset: data.length }}
                    onMove={(hash, from, to) => onCardMove(hash, from, to)} />
            </div>
        </Fragment>
    }
</div>
