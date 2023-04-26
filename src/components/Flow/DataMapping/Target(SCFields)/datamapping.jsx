import { Card } from "primereact/card";
import { Handle } from "reactflow";
import './datamapping.css';

const TargetDataMapping = (props) => {

    const RemoveIcon = () => {
        const showDialog = () => {
            props.deleteNode('delete');
        }

        return (
            <>
                <i className="pi pi-times customClass" onClick={showDialog}></i>
            </>
        )
    }

    return (
        <div className="CardClass">
            <Card header={RemoveIcon} style={{
                width: '200px',
                height: '50px'
            }} title={props.data.label[0]}>
                {props.data.label[1] === 'Export Data'  ?(<Handle className="styleClass" type='source' isConnectable={true} position='right' />):(<Handle className="styleClass" type='target' isConnectable={true} position='left' />)}
            </Card>
        </div>
    )
}

export default TargetDataMapping;