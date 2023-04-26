import { useEffect, useRef, useState, } from "react";
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from "primereact/fileupload";
import { DataTable } from 'primereact/datatable';
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Steps } from 'primereact/steps';
import { saveAs } from 'file-saver';
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Link } from "react-router-dom";
import { InputText } from 'primereact/inputtext';
import { saveWorkFlow, getWorkFlows, runJob, downloadProducts } from "../../services/flowApi";
import "./home.css"
import * as XLSX from 'xlsx';


const Home = () => {
    const [workFlows, setWorkFlows] = useState([]);
    const [render, setRender] = useState(false);
    const saveToast = useRef(null);
    const [importFlow, setImportFlow] = useState([]);
    const [exportFlow, setExportFlow] = useState([]);
    const [activeFile, setActiveFile] = useState([]);
    let workFlowArray = useRef([]);

    useEffect(() => {
        async function getAll() {
            let result = await getWorkFlows();
            workFlowArray.current = result.data;
            let array = [];
            let impArr = [];
            let expArr = [];
            result.data.forEach((obj) => {
                if (obj.graphJSONData !== undefined) {
                    if (obj.graphJSONData.nodes[0].type === 'start') {
                        if (obj.graphJSONData.nodes[0].data.label[1] === 'Import Products') {
                            impArr.push(obj.workFlowName);
                        }
                    }
                }
            })
            setImportFlow(impArr);
            result.data.forEach((obj) => {
                if (obj.graphJSONData !== undefined) {
                    if (obj.graphJSONData.nodes[0].type === 'start') {
                        if (obj.graphJSONData.nodes[0].data.label[1] === 'Export Data') {
                            expArr.push(obj.workFlowName);
                        }
                    }
                }
            })
            setExportFlow(expArr);
            result.data.forEach((elm) => {
                let object = {};
                object['id'] = elm._id;
                object['name'] = elm.workFlowName;
                object['createdAt'] = elm.createdDate.split('T')[0];
                object['totalRuns'] = elm.jobsCount;
                object['successRuns'] = elm.successfulRuns;
                object['failedRuns'] = elm.failedJobs.length;
                array.push(object)
            })
            setWorkFlows(array);
        }
        setRender(false);
        getAll()
    }, [render]);



    const Header = () => {
        const [visible, setVisible] = useState(false);
        const [Import, setImport] = useState(false);
        const [Export, setExport] = useState(false);
        const [searchval, setSearchval] = useState("");
        const [value, setValue] = useState('');
        const [activeIndex, setActiveIndex] = useState(0);
        const [isValid, setIsValid] = useState(true);
        const [warningName, setWarningName] = useState('');

        const WorkflowCard = (props) => {
            let flows = props.workflow;
            flows = props.workflow.filter((obj) => importFlow.includes(obj.name))
            const [flowName, setActiveFlow] = useState('');

            const updateFlow = (e) => {
                setActiveFlow(e.value);
            }

            const clearFile = () => {
                setImport(false);
                setActiveIndex(0);
                setActiveFlow('');
            }

            const sendFile = async () => {
                let payload = {
                    file: activeFile,
                    flow: flowName
                }
                clearFile();
                saveToast.current.show({ severity: 'success', summary: 'Success', detail: 'Workflow job started and is in progress' });
                let result = await runJob(payload);
                if (result.data.status === 'Success') {
                    saveToast.current.show({ severity: 'success', summary: 'Success', detail: 'Job ran successfully' });
                } else {
                    saveToast.current.show({ severity: 'error', summary: 'Error', detail: 'Job failed' });
                }
                let array = [];
                result.data.data.forEach((elm) => {
                    let object = {};
                    object['id'] = elm._id;
                    object['name'] = elm.workFlowName;
                    object['createdAt'] = elm.createdDate.split('T')[0];
                    object['totalRuns'] = elm.jobsCount;
                    object['successRuns'] = elm.successfulRuns;
                    object['failedRuns'] = elm.failedJobs.length;
                    array.push(object)
                })
                setWorkFlows(array);
            }

            return (
                <Card style={{ marginTop: '4px' }}>
                    <Dropdown className="w-full md:w-14rem" value={flowName} onChange={(e) => updateFlow(e)} options={flows} optionLabel="name"
                        placeholder="Select a Flow" />
                    <div style={{ textAlign: 'right' }}>
                        <Button size="small" style={{ margin: '4px' }} onClick={clearFile} outlined label="Cancel" />
                        <Button size="small" style={{ margin: '4px' }} onClick={sendFile} label="Run" />
                    </div>
                </Card>
            )
        }

        const ImportCard = () => {

            const customFileUploader = (e) => {
                let file = e.files[0];
                setActiveFile(file);
                setActiveIndex(1);
            }

            const clearFile = (e) => {
                e.options.clear();
            }

            return (
                <div className="card">
                    <FileUpload auto accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" customUpload={true} chooseOptions={false} onUpload={(e) => clearFile(e)} uploadHandler={(e) => customFileUploader(e)} emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
                </div>
            )
        }

        const FooterDialog = () => {
            const saveText = async () => {
                if (value.length > 0 && isValid) {
                    let data = {
                        name: value
                    }
                    await saveWorkFlow(data)
                    setVisible(false);
                    setRender(true);
                    saveToast.current.show({ severity: 'success', summary: 'Success', detail: 'Workflow created successfully' })
                }
            }
            return (<div><Button label="Reset" outlined size="small" onClick={(e) => setValue("")} /><Button label="Save" onClick={saveText} size="small" /></div>)
        }

        const items = [
            {
                label: 'Drop a file',
                command: () => {

                }
            },
            {
                label: 'Select a Flow',
                command: () => {

                }
            }
        ]

        useEffect(() => {
            if (searchval.length > 2) {
                let result = workFlows.filter((obj) => obj.name.includes(searchval));
                setWorkFlows(result);
            } else if (searchval.length === 0) {
                getAll()
            }

            async function getAll() {
                let result = await getWorkFlows();
                let array = [];
                result.data.forEach((elm) => {
                    let object = {};
                    object['id'] = elm._id;
                    object['name'] = elm.workFlowName;
                    object['createdAt'] = elm.createdDate.split('T')[0];
                    object['totalRuns'] = elm.jobsCount;
                    object['successRuns'] = elm.successfulRuns;
                    object['failedRuns'] = elm.failedJobs.length;
                    array.push(object)
                })
                setWorkFlows(array);
            }
        }, [searchval])

        const checkValue = (e) => {
            if (e.target.value === "") {
                setIsValid(false);
                setWarningName('*Name is required');
            } else {
                let index = workFlows.findIndex((val) => val.name === e.target.value);
                if (index !== -1) {
                    setWarningName('Name already exists');
                    setIsValid(false);
                }
            }
        }

        const checkInputVal = (e) => {
            if (e.target.value.length > 0) {
                let val = e.target.value;
                let index = workFlows.findIndex((val) => val.name === e.target.value);
                let result = /[a-zA-Z]/.test(val);
                let result2 = /^[^\s].+[^\s]$/.test(val);
                let result3 = /^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/.test(val);
                if (index !== -1) {
                    setWarningName('Name already exists');
                    setIsValid(false);
                } else {
                    if ((result && result2) && result3) {
                        setWarningName('');
                        setIsValid(true);
                    } else {
                        setWarningName("Name is not valid");
                        setIsValid(false);
                    }
                }
                setValue(e.target.value);
            } else {
                setIsValid(true);
                setValue(e.target.value);
            }
        }

        const closeFunciton = () => {
            setVisible(false);
            setIsValid(true);
            setValue("");
            setWarningName("");
        }

        const ExportFlows = (props) => {
            let flows = props.workflow;
            flows = props.workflow.filter((obj) => exportFlow.includes(obj.name))
            const [flowName, setActiveFlow] = useState('');

            const updateFlow = (e) => {
                setActiveFlow(e.value);
            }

            const clearFile = () => {
                setExport(false);
                setActiveIndex(0);
                setActiveFlow('');
            }

            const download = async () => {
                setExport(false);
                setActiveIndex(0);
                setActiveFlow('');
                saveToast.current.show({ severity: 'success', summary: 'Success', detail: 'Workflow job started and is in progress' });
                let result = await downloadProducts(flowName);
                if (result.data.type === 'csv') {
                    const blob = new Blob([result.data.data], { type: 'text/csv;charset=utf-8;' });
                    saveAs(blob, 'data.csv');
                    saveToast.current.show({ severity: 'success', summary: 'Success', detail: 'Job ran successfully' });
                } else if (result.data.type === 'xlsx') {
                    // debugger
                    // const data = new Uint8Array(result.data.data);
                    const workbook = XLSX.read(result.data.data, { type: 'buffer' });
                    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                    const blob = new Blob([wbout], { type: 'application/octet-stream' });
                    saveAs(blob, 'data.xlsx');
                    saveToast.current.show({ severity: 'success', summary: 'Success', detail: 'Job ran successfully' });
                } else {
                    saveToast.current.show({ severity: 'error', summary: 'Error', detail: 'Job failed' });
                }

            }

            return (
                <Card style={{ marginTop: '4px' }}>
                    <Dropdown className="w-full md:w-14rem" value={flowName} onChange={(e) => updateFlow(e)} options={flows} optionLabel="name"
                        placeholder="Select a Flow" />
                    <div style={{ textAlign: 'right' }}>
                        <Button size="small" style={{ margin: '4px' }} onClick={clearFile} outlined label="Cancel" />
                        <Button size="small" style={{ margin: '4px' }} onClick={download} label="Run" />
                    </div>
                </Card>
            )
        }

        return (
            <div className="headerCardClass">
                <div style={{ fontSize: '18px' }}>
                    WorkFlows
                </div>
                <div className="rightPaneHomeCard">
                    <Button style={{ marginRight: '12px' }} icon="pi pi-upload" size="small" outlined aria-label="Import" tooltip="Upload" onClick={() => setImport(true)}></Button>
                    <Button style={{ marginRight: '12px' }} icon="pi pi-download" size="small" outlined aria-label="Export" tooltip="Download" onClick={() => setExport(true)}></Button>
                    <Dialog draggable={false} style={{ width: '40vw' }} header="Import the Products" visible={Import} onHide={() => setImport(false)}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Steps model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={true} />
                            {activeIndex === 0 ? (<ImportCard />) : (<WorkflowCard workflow={workFlows} />)}
                        </div>
                    </Dialog>
                    <Dialog draggable={false} style={{ width: '40vw' }} header="Export the Products" visible={Export} onHide={() => setExport(false)}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <ExportFlows workflow={workFlows} />
                        </div>
                    </Dialog>
                    <span style={{ marginRight: "12px" }} className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText placeholder="Search" className="p-inputtext-sm" onChange={(e) => setSearchval(e.target.value)} />
                    </span>
                    <Button size="small" onClick={() => setVisible(true)}>Create Workflow</Button>
                    <Dialog draggable={false} style={{ width: '30vw' }} header="Create a workflow" visible={visible} footer={FooterDialog} onHide={() => closeFunciton()}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="username" style={{ paddingBottom: '4px' }}>Name</label>
                            <InputText className={isValid ? '' : 'p-invalid'} id="username" value={value} onBlur={(e) => checkValue(e)} onChange={(e) => checkInputVal(e)} size='small' />
                            {isValid ? '' : (<span style={{ color: 'red', fontSize: '12px' }}>{warningName}</span>)}
                        </div>
                    </Dialog>
                </div>
            </div>
        )
    }

    const elmLink = (rowData) => {
        let url = `/workflow-create/${rowData.id}`
        return (
            <Link to={url} className="linkClass" style={{ textDecoration: 'none' }}>{rowData.name}</Link>
        )
    }

    const ListOfJobs = (rowData) => {
        const [DV, setDV] = useState(false);
        let flow = {};
        if (workFlowArray.current.length > 0) {
            let index = workFlowArray.current.findIndex((obj) => obj._id === rowData.id);
            flow = workFlowArray.current[index];
        }

        return (
            <div className="card flex justify-content-center">
                <p onClick={(e) => setDV(true)} style={{ cursor: 'pointer' }}>{rowData.failedRuns}</p>
                <Dialog visible={DV} draggable={false} style={{ width: '30vw' }} headerStyle={{ paddingBottom: '2px' }} header="Failed Jobs" onHide={() => setDV(false)}  >
                    <ul style={{ listStyleType: 'none', paddingLeft: '0px' }}>{
                        flow.failedJobs !== undefined ? (flow.failedJobs.map((item, index) => {
                            return (
                                <li key={index}>{index + 1} - {item}</li>
                            )
                        })) : ""
                    }</ul>
                </Dialog>
            </div>
        )
    }

    return (
        <div className="homeCardClass">
            <Toast ref={saveToast} />
            <DataTable showGridlines value={workFlows} header={Header} tableStyle={{ minWidth: '50rem' }}>
                <Column field="name" sortable header="Name" body={elmLink}></Column>
                <Column field="createdAt" sortable header="Created At"></Column>
                <Column field="totalRuns" header="Total Runs"></Column>
                <Column field="successRuns" header="Successful Runs"></Column>
                <Column field="failedRuns" header="Failed Runs" body={ListOfJobs}></Column>
            </DataTable>
        </div>
    )
}


export default Home;