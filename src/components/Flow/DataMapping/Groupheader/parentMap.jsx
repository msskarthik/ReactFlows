import { Handle } from "reactflow";
import './parentMap.css';
import { useEffect, useState } from "react";

const ParentMap = (props) => {

    const showDialog = () => {
        props.deleteNode('delete');
    }

    return (
        <div className="CardClass">
            <i className="pi pi-times customClass" onClick={showDialog}></i>
            <h6 style={{ textAlign: 'center' }}>{props.data.label}</h6>
            {props.data.label === 'SC Fields'? (<Handle className="styleClass" type='source' isConnectable={true} position='right' />):(<Handle className="styleClass" type='target' isConnectable={true} position='left' />)}
        </div>
    )
}

export default ParentMap;