import { Card } from 'primereact/card';
import { Handle } from 'reactflow';
import './startNode.css';

const StartNode = (props) => {
    const ShowCardSelection = () => {
        props.addtrigger('startTrigger')
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
            }} onDoubleClick={ShowCardSelection} header={RemoveIcon} title={props.data.label[0]}>
                <h1 className='selectedClass'>{props.data.label[1]}</h1>
                <Handle className='styleClass' type='source' isConnectable={true} position='right' />
            </Card>
        </div>
    )
}

export default StartNode;