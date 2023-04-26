import { Card } from "primereact/card";
import { Handle } from "reactflow";
import './datamapping.css';

const ExportDataMapping = (props) => {

    const showDialog = () => {
        props.deleteNode('delete');
    }

    return (
        <div className="CardClass">
            <i className="pi pi-times customClass" onClick={showDialog}></i>
            <h6 style={{ textAlign: 'center' }}>{props.data.label}</h6>
            <Handle className="styleClass" type='source' isConnectable={true} position='right' />
        </div>
    )
}

export default ExportDataMapping;