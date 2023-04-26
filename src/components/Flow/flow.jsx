import { useCallback, useState, useRef, useMemo, useEffect } from "react";
import ReactFlow, { ReactFlowProvider, Background, addEdge, updateEdge, Controls, MiniMap, useEdgesState, useNodesState } from "reactflow";
import 'reactflow/dist/style.css';
import ConditionNode from "./Nodes/ConditionNode/conditionNode.jsx";
import StartNode from "./Nodes/StartNode/startNode.jsx";
import EndNode from "./Nodes/EndNode/endNode.jsx";
import ActionBar from "./Sidebar/Start/actionSidebar.jsx";
import ConditionBar from "./Sidebar/Condition/conditionSidebar.jsx";
import EndSideBar from "./Sidebar/End/endSidebar.jsx";
import { Toast } from 'primereact/toast';
import { Sidebar } from 'primereact/sidebar';
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import ToolBar from "./ToolBar/toolbar.jsx";
import { updateWorkFlows, getWorkFlowSelected } from "../../services/flowApi";
import DataMapping from "./DataMapping/Source(Import)/datamapping.jsx";
import ExportMap from "./DataMapping/ExportMap/exportMapping.jsx";
import TargetDataMapping from "./DataMapping/Target(SCFields)/datamapping.jsx";
import ParentMap from "./DataMapping/Groupheader/parentMap.jsx";
import ExportDataMapping from "./DataMapping/Target(ExportFields)/datamapping.jsx";
import './flow.css';
import { InputText } from "primereact/inputtext";

const getId = () => `dndnode_${Math.random().toString(36).slice(-10)}`;

const Flow = () => {
    const nodeTypes = useMemo(() => ({ exportParent: (props) => <ExportDataMapping deleteNode={deleteNode} {...props} />,exportMap: (props) => <ExportMap {...props} />, parentMap: (props) => <ParentMap {...props} />, targetMap: (props) => <TargetDataMapping deleteNode={deleteNode} {...props} />, dataMap: (props) => <DataMapping {...props} deleteNode={deleteNode} />, start: (props) => <StartNode item={activeActionItem} deleteNode={deleteNode} addtrigger={addtrigger} {...props} />, condition: (props) => <ConditionNode deleteNode={deleteNode} addtrigger={addtrigger} {...props} />, end: (props) => <EndNode deleteNode={deleteNode} addtrigger={addtrigger} {...props} /> }), []);
    const reactFlowWrapper = useRef(null);
    const edgeUpdateSuccessful = useRef(true);
    const toast = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [activeActionItem, setActiveActionItem] = useState({});
    const [activeNode, setactiveNode] = useState({});
    const [trigger, setTrigger] = useState("");
    const [visible, setVisible] = useState(false);
    const [endVisible, setEndVisible] = useState(false);
    const [conditionvisible, setConditionVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [inputVisible,setInputVisible] = useState(false);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [editText,setEditText] = useState('');

    useEffect(() => {
        async function getData() {
            const Id = window.location.pathname.split('create/')[1];
            const workFlowAvailable = await getWorkFlowSelected(Id);
            if (workFlowAvailable.data.graphJSONData !== undefined) {
                let flow = workFlowAvailable.data.graphJSONData;
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
            }
        }

        getData()
    }, [])

    const addtrigger = (e) => {
        if (e === 'startTrigger') {
            setVisible(true);
        } else if (e === 'selectCondition') {
            setConditionVisible(true);
        } else if (e === 'endTrigger') {
            setEndVisible(true);
        }
    }

    const deleteNode = () => {
        setDeleteVisible(true);
    }

    const onEdgeUpdateStart = useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, []);

    const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
        edgeUpdateSuccessful.current = true;
        setEdges((els) => updateEdge(oldEdge, newConnection, els));
    }, []);

    const onEdgeUpdateEnd = useCallback((_, edge) => {
        if (!edgeUpdateSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }

        edgeUpdateSuccessful.current = true;
    }, []);

    const triggerProducts = async (e) => {
        if (e === 'pullData') {
            const result = ['Name', 'Code', 'Brand', 'Description', 'Categories', 'MSRP', 'MAP', 'Cost Price', 'Large Image', 'Thumbnail Image', 'Supplier SKU ID', 'Manufacturer SKU ID', 'Swatch Image', 'Color', 'Size', 'Fit'];
            let n = nodes.length;
            let newOne = 0
            if (n !== 0) {
                if (nodes[n - 1].extent !== undefined) {
                    let parentIndex = nodes.findIndex((obj) => obj.id === nodes[n - 1].parentNode);
                    newOne = nodes[parentIndex].width + nodes[parentIndex].position.x;
                } else {
                    newOne = nodes[n - 1].width + nodes[n - 1].position.x;
                }
            }
            let pos = reactFlowInstance.getViewport();
            const position = reactFlowInstance.project({
                x: newOne + 20 + pos.x,
                y: 20 + pos.y,
            });
            let height = 0;
            if (pos.zoom <= 1) {
                height = ((result.length + 1) * 70) + pos.y * pos.zoom;
            } else {
                height = ((result.length + 1) * 70);
            }
            let newNode = {
                id: 'target',
                position,
                type: 'parentMap',
                data: { label: 'SC Fields' },
                className: 'light',
                style: { backgroundColor: 'rgb(26 115 232 / 31%)', width: 250, height: height },
            };
            if (trigger !== 'Import Products' && trigger !== '') {
                newNode.data.label = 'Product Fields';
            }

            setNodes((nds) => nds.concat(newNode));
            let top = 20 + pos.x;
            let left = 0 + pos.y;
            result.forEach((item) => {
                left += 70 * pos.zoom;
                const position = reactFlowInstance.project({
                    x: top,
                    y: left,
                });
                let newNode = {
                    id: getId(),
                    type: 'targetMap',
                    position,
                    data: { label: [item,'Import Products'] },
                    parentNode: 'target',
                    extent: 'parent'
                };
                if (trigger !== '' && trigger !== 'Import Products') {
                    newNode.data.label[1] = 'Export Data';
                }
                setNodes((nds) => nds.concat(newNode));
            })
        } else {
            const result = ['Name', 'Code', 'Brand', 'Description', 'Categories', 'MSRP', 'MAP', 'Cost Price', 'Large Image', 'Thumbnail Image', 'Supplier SKU ID', 'Manufacturer SKU ID', 'Swatch Image', 'Color', 'Size', 'Fit'];
            let n = nodes.length;
            let newOne = 0
            if (n !== 0) {
                if (nodes[n - 1].extent !== undefined) {
                    let parentIndex = nodes.findIndex((obj) => obj.id === nodes[n - 1].parentNode);
                    newOne = nodes[parentIndex].width + nodes[parentIndex].position.x;
                } else {
                    newOne = nodes[n - 1].width + nodes[n - 1].position.x;
                }
            }
            let pos = reactFlowInstance.getViewport();
            const position = reactFlowInstance.project({
                x: newOne + 20 + pos.x,
                y: 20 + pos.y,
            });
            let height = 0;
            if (pos.zoom <= 1) {
                height = ((result.length + 1) * 70) + pos.y * pos.zoom;
            } else {
                height = ((result.length + 1) * 70);
            }
            let newNode = {
                id: 'export',
                position,
                type: 'exportParent',
                data: { label: 'Your Fields' },
                className: 'light',
                style: { backgroundColor: 'rgb(26 115 232 / 31%)', width: 250, height: height },
            };
            setNodes((nds) => nds.concat(newNode));
            let top = 20 + pos.x;
            let left = 0 + pos.y;
            result.forEach((item) => {
                left += 70 * pos.zoom;
                const position = reactFlowInstance.project({
                    x: top,
                    y: left,
                });
                let newNode = {
                    id: getId(),
                    type: 'exportMap',
                    position,
                    data: { label: [item,''] },
                    parentNode: 'export',
                    extent: 'parent'
                };
                setNodes((nds) => nds.concat(newNode));
            })
        }
    }

    const onNodeClick = (event, node) => {
        setactiveNode(node);
    }

    useEffect(() => {
        let links = edges;
        if (links.length > 0) {
            links.forEach((obj) => {
                if (obj.animated === undefined) {
                    obj.animated = true
                }
            })
            setEdges(links)
        }
    }, [edges, setEdges])

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
    }, []);

    const onDrop = useCallback((event) => {
        event.preventDefault();
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        let type = event.dataTransfer.getData('text/plain');
        let newNode = {};
        if (type.includes('start')) {
            type = 'start';
            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            newNode = {
                id: getId(),
                type,
                position,
                data: { label: [`Add a trigger`, ''] },
            };
        } else if (type.includes('condition')) {
            type = 'condition';
            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            newNode = {
                id: getId(),
                type,
                position,
                data: { label: [`Select a condition`, ''], actions: [] },
            };
        } else if (type.includes('end')) {
            type = 'end';
            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            newNode = {
                id: getId(),
                type,
                position,
                data: { label: [`select action when job is done`, ''] },
            };
        } else {
            type = 'default'
        }

        setNodes((nds) => nds.concat(newNode));
    }, [reactFlowInstance, setNodes])

    const selectedItems = (obj) => {
        if (obj.type === 'trigger') {
            setVisible(false);
            const index = nodes.findIndex((el) => el.id === activeNode.id);
            let newNodes = [...nodes];
            newNodes[index].data = { ...newNodes[index].data, label: ['Triggers when..', obj.action] }
            setTrigger(obj.action);
            setNodes(newNodes);j
        } else if (obj.type === 'condition') {
            setConditionVisible(false);
            const index = nodes.findIndex((el) => el.id === activeNode.id);
            let newNodes = [...nodes];
            newNodes[index].data = { ...newNodes[index].data, ...obj, label: ['Conditions'] }
            setNodes(newNodes);
        } else if (obj.type === 'end') {
            setEndVisible(false);
            const index = nodes.findIndex((el) => el.id === activeNode.id);
            let newNodes = [...nodes];
            newNodes[index].data = { ...newNodes[index].data, label: ['End job with...', obj.action] }
            setNodes(newNodes);
        }
    }

    const sourceMapArray = (e) => {
        let n = nodes.length;
        let newOne = 0
        if (n !== 0) {
            if (nodes[n - 1].extent !== undefined) {
                let parentIndex = nodes.findIndex((obj) => obj.id === nodes[n - 1].parentNode);
                newOne = nodes[parentIndex].width + nodes[parentIndex].position.x;
            } else {
                newOne = nodes[n - 1].width + nodes[n - 1].position.x;
            }
        }
        let result = e;
        const position = reactFlowInstance.project({
            x: newOne + 20,
            y: 20,
        });
        let height = (result.length + 1) * 70;
        let newNode = {
            id: 'source',
            position,
            type: 'parentMap',
            data: { label: 'Import Fields' },
            className: 'light',
            style: { backgroundColor: 'rgb(26 115 232 / 31%)', width: 250, height: height },
        };
        setNodes((nds) => nds.concat(newNode));
        let top = 20;
        let left = 0;
        result.forEach((item) => {
            // const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            left += 70;
            const position = reactFlowInstance.project({
                x: top,
                y: left,
            });
            let newNode = {
                id: getId(),
                type: 'dataMap',
                position,
                data: { label: [item,''] },
                parentNode: 'source',
                extent: 'parent'
            };
            

            setNodes((nds) => nds.concat(newNode));
        })
    }

    const checkNodeDrag = (e, n) => {
        if (n.extent !== undefined) {
            e.stopPropagation();
        }
    }

    const saveWork = async (e) => {
        const data = reactFlowInstance.toObject();
        let url = window.location.pathname.split('create/')[1];
        let payload = {
            id: url,
            data: data
        }
        let result = await updateWorkFlows(payload);
        if (result.data === 'Workflow updated successfully') {
            toast.current.show({ severity: 'success', summary: 'Success', detail: result.data });
        }
    }

    const sendActiveNode = (e, n) => {
        setActiveActionItem(n.data);
        if (n.parentNode === 'export') {
            setEditText(n.data.label[0])
            setInputVisible(true);
        }
    }

    const FooterButtons = () => {

        const deleteTrigger = () => {
            let finalNodes = nodes.filter((node) => node.id !== activeNode.id);
            setNodes(finalNodes);

            setDeleteVisible(false);
        }

        const cancelDelete = () => {
            setDeleteVisible(false);
        }

        return (
            <div><Button label="No" onClick={cancelDelete} outlined size="small" /><Button label="Yes" onClick={deleteTrigger} size="small" /></div>
        )
    }


    const FooterinputButtons = () => {

        const deleteTrigger = () => {
            let index = nodes.findIndex((node) => node.id === activeNode.id);
            nodes[index].data.label[0] = editText;
            setNodes(nodes);

            setInputVisible(false);
        }

        const cancelDelete = () => {
            setEditText('');
        }

        return (
            <div><Button label="Reset" onClick={cancelDelete} outlined size="small" /><Button label="Save" onClick={deleteTrigger} size="small" /></div>
        )
    }

    return (
        <div className="flowPageClass">
            <Toast ref={toast} />
            <div>
                <ToolBar saveWorkFlow={saveWork} getData={triggerProducts} MapArray={sourceMapArray} />
            </div>
            <div className="flowGraphClass">
                <ReactFlowProvider>
                    <div className="wrapperClass" ref={reactFlowWrapper}>
                        <ReactFlow
                            nodes={nodes}
                            onNodeClick={(e, n) => onNodeClick(e, n)}
                            edges={edges}
                            nodeTypes={nodeTypes}
                            onNodeDrag={(e, n) => checkNodeDrag(e, n)}
                            onNodeDoubleClick={(e, n) => sendActiveNode(e, n)}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onEdgeUpdate={onEdgeUpdate}
                            onEdgeUpdateStart={onEdgeUpdateStart}
                            onEdgeUpdateEnd={onEdgeUpdateEnd}
                            onInit={setReactFlowInstance}
                            onDrop={onDrop}
                            onConnect={onConnect}
                            onDragOver={onDragOver}
                        >
                            <Controls />
                            <MiniMap />
                            <Background variant="dots" gap={12} size={1} />
                        </ReactFlow>
                    </div>
                </ReactFlowProvider>
            </div>
            <div className="card flex justify-content-center">
                <Sidebar dismissable={false} visible={visible} position='right' onHide={() => setVisible(false)}>
                    <ActionBar propData={activeActionItem} selectedItem={selectedItems} />
                </Sidebar>
                <Sidebar dismissable={false} className="w-full md:w-30rem lg:w-30rem" visible={conditionvisible} position='right' onHide={() => setConditionVisible(false)}>
                    <ConditionBar propData={activeActionItem} selectedItem={selectedItems} />
                </Sidebar>
                <Sidebar dismissable={false} visible={endVisible} position='right' onHide={() => setEndVisible(false)}>
                    <EndSideBar propData={activeActionItem} type={trigger} selectedItem={selectedItems} />
                </Sidebar>
                <Dialog draggable={false} header="Delete Node" visible={deleteVisible} style={{ width: '30vw' }} footer={FooterButtons} onHide={() => setDeleteVisible(false)}>
                    <p className="m-0" style={{ fontWeight: '500' }}>
                        Are you sure you want to delete the node?
                    </p>
                </Dialog>
                <Dialog draggable={false} header="Delete Node" visible={inputVisible} style={{ width: '30vw' }} footer={FooterinputButtons} onHide={() => setInputVisible(false)}>
                    <InputText value={editText} onChange={(e) => setEditText(e.target.value)} />
                </Dialog>
            </div>
        </div>
    )
}

export default Flow;