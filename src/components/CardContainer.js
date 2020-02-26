import React from "react";
import Card from "./Card";
import CpuInfo from "./CpuInfo";
import MemInfo from "./MemInfo";
import DiskInfo from "./DiskInfo";

const tileTypeMap = {
    cpu: CpuInfo,
    memory: MemInfo,
    disk: DiskInfo
};

export default ({ label, data, index, onMove, onCardMove, onCardDelete }) => 
<div className="column" draggable="true"
    onDragOver={e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }}
    onDrop={e => {
        e.preventDefault();
        if (e.dataTransfer.getData('dragging') === 'column') {
            onMove(JSON.parse(e.dataTransfer.getData('position')), index);
        }
    }}
    onDragStart={e => {
        e.stopPropagation();
        e.dataTransfer.setData('dragging', 'column');
        e.dataTransfer.setData('position', index);
    }}>
    <header>
        <h4>{label}</h4>
    </header>
    <div className="card-container">
        {data.map((item, i) => <Card
            key={item.hash}
            type={tileTypeMap[item.type]}
            data={item.data}
            position={{ column: index, offset: i}}
            hash={item.hash}
            onMove={(hash, from, to) => onCardMove(hash, from, to)}
        />)}
        <div style={{ flex: 1 }}
            onDragOver={e => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            }}
            onDrop={e => {
                e.preventDefault();
                if (e.dataTransfer.getData('dragging') === 'card') {
                    e.stopPropagation();
                    const to = { column: index, offset: data.length };
                    onCardMove(e.dataTransfer.getData('hash'), JSON.parse(e.dataTransfer.getData('position')), to);
                }
            }}
        ></div>
    </div>
</div>
