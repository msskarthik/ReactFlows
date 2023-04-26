import { Card } from 'primereact/card';
import { Handle } from 'reactflow';
import './endNode.css';

const EndNode = (props) => {
    const ShowCardSelection = () => {
        props.addtrigger('endTrigger')
    }

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
        <div className='CardClass'>
            <Card style={{
                width: '200px',
                height: '100px'
            }} header={RemoveIcon} onDoubleClick={ShowCardSelection} title={props.data.label[0]}>
                <h1 className='selectedClass'>{props.data.label[1]}</h1>
                <Handle className='styleClass' type='target' isConnectable={true} position='left' />
            </Card>
        </div>
    )
}

export default EndNode;