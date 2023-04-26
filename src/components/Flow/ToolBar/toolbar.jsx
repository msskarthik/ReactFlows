import { Image } from 'primereact/image';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { getHeaders } from '../../../services/flowApi';
import './toolbar.css';

const ToolBar = (props) => {

    const customFileUploader = async (e) => {
        const file = e.files[0];
        let result = await getHeaders(file);
        let array = result.data;
        clearFile(e);
        props.MapArray(array);
    }

    const clearFile = (e) => {
        e.options.clear();
    }

    return (
        <>
            <div className='parentSideBar'>
                <div className="sideBarClass">
                    <div>
                        <span
                            style={{ fontWeight: 500, fontSize: "16px", padding: "10px" }}
                        >
                            Utilities
                        </span>
                        <div style={{ marginTop: '10px' }}>
                            <Image
                                alt="start"
                                className="shapeClass"
                                width="60"
                                title="Start"
                                src={require("../../../assets/shapes/start.svg").default}
                            />
                            <Image
                                alt="condition"
                                width="60"
                                title="Condition"
                                className="shapeClass"
                                src={require("../../../assets/shapes/condition.svg").default}
                            />
                            <Image
                                alt="end"
                                className="shapeClass"
                                width="60"
                                title="End"
                                src={require("../../../assets/shapes/end.svg").default}
                            />
                        </div>
                    </div>
                    <div>
                        <span
                            style={{ fontWeight: 500, fontSize: "16px", padding: "10px" }}
                        >
                            Data Mapping
                        </span>
                        <div>
                            <Button style={{ margin: '5px 0 5px 10px' }} size='small' label="Format Products" onClick={() => {
                                props.getData('formatProducts')
                            }} />
                            <Button style={{ margin: '5px 0 5px 10px' }} size='small' label="Add Products" onClick={() => {
                                props.getData('pullData')
                            }} />
                            <FileUpload mode="basic" auto accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" customUpload={true} chooseLabel='Upload' onUpload={clearFile} uploadHandler={customFileUploader} />
                        </div>
                    </div>
                </div>
                <div>
                    <Button style={{ marginLeft: '10px', marginBottom: '8px' }} label='Save WorkFlow' onClick={(e) => props.saveWorkFlow('save')} size='small' />
                </div>
            </div>
        </>
    )
}

export default ToolBar;