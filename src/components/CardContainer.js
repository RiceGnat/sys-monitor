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

export default ({ label, data }) => 
<div>
    <header>
        <h5>{label}</h5>
    </header>
    <div className="card-container">
        {data.map(item => <Card type={tileTypeMap[item.type]} data={item.data} />)}
    </div>
</div>
