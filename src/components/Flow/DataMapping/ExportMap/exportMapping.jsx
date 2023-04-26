import { Card } from "primereact/card";
import { Handle } from "reactflow";
import './exportMapping.css';

const ExportMap = (props) => {

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
                <Handle className="styleClass" type='target' isConnectable={true} position='left' />
            </Card>
        </div>
    )
}

export default ExportMap;