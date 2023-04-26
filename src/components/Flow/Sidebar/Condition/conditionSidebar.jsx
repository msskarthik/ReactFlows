import { useState, memo, useCallback, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { PanelMenu } from 'primereact/panelmenu';
import { InputText } from 'primereact/inputtext';
import './conditionSidebar.css';
import { Button } from 'primereact/button';

const ConditionBar = (props) => {
    const [selectedCondition, setSelectedCondition] = useState('');
    const [allActions, setAllActions] = useState([]);
    const conditions = ['All conditions are met', 'Any conditions are met'];
    const options = [
        'Equal To',
        'Not Equal To',
        'Includes',
        'Does Not Includes',
        'Starts With',
        'Does Not Starts With',
        'Ends With',
        'Does Not Ends With',
        'Empty',
        'Not Empty'
    ];

    useEffect(() => {
        if (props.propData.actions.length !== 0) {
            setSelectedCondition(props.propData.condition)
            setAllActions(props.propData.actions);
        }
    },[props])

    const items = [
        {
            label: 'Products',
            items: [
                {
                    label: 'MSRP',
                    command: useCallback(() => {
                        const newItem = {
                            name: 'MSRP',
                            value: '',
                            option: ''
                        };
                        setAllActions((prevItems) => [...prevItems, newItem]);
                    }, [])
                },
                {
                    label: 'MAP',
                    command: useCallback(() => {
                        const newItem = {
                            name: 'MAP',
                            value: '',
                            option: ''
                        };
                        setAllActions((prevItems) => [...prevItems, newItem]);
                    }, [])
                },
                {
                    label: 'Cost Price',
                    command: useCallback(() => {
                        const newItem = {
                            name: 'Cost Price',
                            value: '',
                            option: ''
                        };
                        setAllActions((prevItems) => [...prevItems, newItem]);
                    },[])
                },
            ]
        },
        {
            label: 'Mail',
            items: [
                {
                    label: 'Send Mail',
                    command: useCallback(() => {
                        const newItem = {
                            name: 'Send Mail',
                            value: '',
                            option: ''
                        };
                        setAllActions((prevItems) => [...prevItems, newItem]);
                    },[])
                }
            ]
        },
    ];


    const ListItem = memo(({ number, itemName,option,values }) => {
        const  [text,Settext] = useState(values);

        const valueFunction = (e) => {
            let index = allActions.findIndex((obj) => obj.name === itemName);
            allActions[index].option = e.target.value;
            setAllActions([...allActions])
        }

        const inputFunction = (e) => {
            let index = allActions.findIndex((obj) => obj.name === itemName);
            allActions[index].value = e.target.value;
            Settext(e.target.value)
            setAllActions([...allActions])
        }

        return (
            <div>
                <h6>{itemName}</h6>
                <Dropdown id='dropDown' size={'sm'} className="w-full md:w-14rem" value={option} onChange={(e) => valueFunction(e)} options={options} />
                <InputText value={text} onBlur={(e) => inputFunction(e)} onChange={(e) => Settext(e.target.value)} />
                {
                    allActions.length - 1 !== number ? (<h6>{selectedCondition === 'All conditions are met' ? 'AND' : 'OR'}</h6>) : ''
                }
            </div>
        )
    })

    const ConditionCard = () => {

        const sendPropsToParent = () => {
            // debugger
            let obj = {
                type:'condition',
                condition: selectedCondition,
                actions: allActions
            }
            props.selectedItem(obj);
        }

        const clearConditions = () => {
            setAllActions([])
        }

        return (
            <Card style={{ marginTop: '10px' }}>
                <div>{selectedCondition === 'All conditions are met' ? 'Need to meet all conditions' : 'Need to meet any condition'}</div>
                <div>{allActions.map((item, index) => (
                    <ListItem key={item} number={index} itemName={item.name} values={item.value} option={item.option} />
                ))}</div>
                <Button style={{ marginTop: '10px', marginRight:'10px' }} outlined onClick={() => clearConditions()} label='Clear' size='small' />
                <Button disabled={allActions.length === 0? true: false} style={{ marginTop: '10px' }} onClick={() => sendPropsToParent()} label='Save' size='small' />
            </Card>
        )
    }

    return (
        <>
            <div>
                <Dropdown className='dropDownClass' size={'sm'} placeholder={'Select type of condition'} value={selectedCondition} onChange={(e) => setSelectedCondition(e.value)} options={conditions} />
                {selectedCondition !== ''? (<Card>
                    <div>
                        <h5>Choose Properties</h5>
                        <div className="card flex justify-content-center">
                            <PanelMenu model={items} className="w-full md:w-25rem" />
                        </div>
                    </div>
                </Card>):''}
                <>{
                    selectedCondition !== '' ? <ConditionCard /> : ''
                }</>
            </div>
        </>
    )
}

export default ConditionBar;