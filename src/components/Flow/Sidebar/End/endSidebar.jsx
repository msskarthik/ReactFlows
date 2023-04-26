import { Menu } from 'primereact/menu';
import './endSidebar.css';
import { useEffect, useState } from 'react';

const EndSideBar = (props) => {
    const [array,setArray] = useState([]);

    useEffect(() => {
        if (props.type === 'Export Data') {
            let arr = [
                {
                    label: 'Download in CSV Format',
                    command: () => props.selectedItem({type:'end',action:'CSV'})
                },
                //  {
                //     label: 'Download in Excel Format',
                //     command: () => props.selectedItem({type:'end',action:'Excel'})
                // }
            ];
            setArray(arr);
        } else {
            let arr = [
                {
                    label: 'Send a mail if Job is Successful',
                    command: () => props.selectedItem({type:'end',action:'Send Mail'})
                }, {
                    label: 'Publish the products to storefront',
                    command: () => props.selectedItem({type:'end',action:'Publish Products'})
                }
                , {
                    label: 'Send a mail if Job is Failed',
                    command: () => props.selectedItem({type:'end',action:'Send Error Mail'})
                }
            ];
            setArray(arr);
        }
    },[props])

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

export default EndSideBar;