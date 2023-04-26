import { Menu } from 'primereact/menu';
import './actionSidebar.css';
import { useEffect, useState } from 'react';

const ActionBar = (props) => {
    const [classs,setClasss] = useState('');

    useEffect(() => {
        if (props.propData.label[1] !== '') {
            setClasss(props.propData.label[1])
        }
    },[props])

    const array = [
        {
            label: 'Upload Product file to Import',
            className: classs === 'Import Products' ? 'actionCustomClass':'' ,
            command: () => props.selectedItem({type:'trigger',action:'Import Products'})
        }, {
            label: 'Export Data into File',
            className: classs === 'Export Data' ? 'actionCustomClass':'' ,
            command: () => props.selectedItem({type:'trigger',action:'Export Data'})
        }
    ]

    return (
        <>
            <h4 className='actionClass'>Select an Action</h4>
            <Menu style={{
                height: '100 %',
                width: 'auto'
            }} model={array} />
        </>
    )
}

export default ActionBar;