import { Card } from "primereact/card";
import { Handle } from "reactflow";
import './datamapping.css';

const DataMapping = (props) => {

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
            }} title={props.data.label}>
                {/* <h1 className='selectedClass'>{props.data.label[1]}</h1> */}
                <Handle className="styleClass" type='source' isConnectable={true} position='right' />
            </Card>
        </div>
    )
}

export default DataMapping;