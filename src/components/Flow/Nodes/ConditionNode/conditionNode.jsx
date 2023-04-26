import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Handle } from 'reactflow';
import './conditionNode.css';

const ConditionNode = (props) => {
    const [actions, setActions] = useState([]);
    const [condition,setCondition] = useState('');
    const [customHeight,setCustomHeight] = useState('');
    const [title,setTitle] = useState('Select a Condition');
    const [displayCondition,setDisplayCondition] = useState('');

    useEffect(() => {
        if (props.data.condition === 'All conditions are met') {
            setCondition('All')
            setDisplayCondition('And');
        } else if (props.data.condition === 'Any conditions are met') {
            setCondition('Any')
            setDisplayCondition('Or');
        }
        let action = props.data.actions;
        let ht = `${100 + (action.length * 5)}px`;
        setCustomHeight(ht);
        setActions(action);
        if (props.data.label[0] === 'Conditions') {
            let res = condition + ' ' + props.data.label[0];
            setTitle(res)
        }
    }, [props])

    const ShowCardSelection = () => {
        props.addtrigger('selectCondition');
    }

    const ListItem = ({name,value,option,number}) => {
        return (
            <>
                <h6 style={{margin:'2px'}}>{name + " " + option+ " " + value}</h6>
                {number !== actions.length -1 ? (<h6 style={{margin:'2px'}}>{displayCondition}</h6>):''}
            </>
        )
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
        <div onDoubleClick={ShowCardSelection} className='CardClass'>
            <Card style={{
                width: '200px',
                height: customHeight
            }} header={RemoveIcon} title={title}>
                <div>{actions.map((item,index) => {
                        return (
                            <ListItem key={item.name} name={item.name} value={item.value} option={item.option} number={index} />)
                    })}
                </div>
                <Handle className='styleClass' type='source' isConnectable={true} position='right' />
                <Handle className='styleClass' type='target' isConnectable={true} position='left' />
            </Card>
        </div>
    )
}

export default ConditionNode;