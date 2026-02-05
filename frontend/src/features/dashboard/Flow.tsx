import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  BackgroundVariant,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  OnSelectionChangeParams,
  ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useState } from "react";
import { DnDProvider } from "./util/useDnD";
import { Sidebar } from "./util/ToolSidebar";
import CustomNode from "./components/nodes/CustomNode";
import SubFlow from "./components/nodes/SubFlow";
import { NodeInspector } from "./components/Inspector/NodeInspector";
import { EdgeInspector } from "./components/Inspector/EdgeInspector";
import { updateFile } from "@/api/files";
import { Button } from "@/appcomponents/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import DownloadButton from "./util/FlowToImage";

const nodeTypes = {
  customNode: CustomNode,
  group: SubFlow
};
const connectionLineStyle = { stroke: '#ffff' };
const defaultViewPort = {x: 0,y:0,zoom:1.5}
// const defaultEdgeOptions = {
//   animated: true,
//   type: 'smoothstep',
// };
const Flow = ({ node, edge }: any) => {
  const selectedFile = useSelector(
    (state: RootState) => state.dashboard.selectedFile
  );
  
  const [nodes, , onNodesChange] = useNodesState(node);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edge);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Inspector state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [setEdges]
  );

  // Handle selection changes
  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    if (params.nodes.length > 0) {
      setSelectedNodeId(params.nodes[0].id);
      setSelectedEdgeId(null);
    } else if (params.edges.length > 0) {
      setSelectedEdgeId(params.edges[0].id);
      setSelectedNodeId(null);
    } else {
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
    }
  }, []);

  const handleSave = async () => {
    if (!selectedFile) return;
    setIsSaving(true);
    try {
      const fileData = {
        nodes: nodes,
        edges: edges,
      };
      const res = await updateFile(selectedFile.id, fileData);
      console.log(res);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.log("Error saving file:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <ReactFlowProvider>
        <DnDProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onSelectionChange={onSelectionChange}
            connectionLineStyle={connectionLineStyle}
            connectionLineType={ConnectionLineType.SmoothStep}
            snapToGrid={true}
            snapGrid={[25, 25]}
            defaultViewport={defaultViewPort}
            fitView
            attributionPosition="bottom-left"
            colorMode="dark"
          >
            <Background variant={BackgroundVariant.Dots} />
            <Controls orientation="horizontal" position="bottom-center" />
            <MiniMap />
          </ReactFlow>

          {/* Save Button */}
          <div className="absolute top-5 right-4 flex gap-2 z-10">
            <DownloadButton/>
            <Button
              className="p-regular"
              variant="secondary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save"}
            </Button>
          </div>

          {/* Sidebar */}
          <Sidebar />

          {/* Inspector Panels */}
          {selectedNodeId && (
            <NodeInspector
              nodeId={selectedNodeId}
              onClose={() => setSelectedNodeId(null)}
            />
          )}
          
          {selectedEdgeId && (
            <EdgeInspector
              edgeId={selectedEdgeId}
              onClose={() => setSelectedEdgeId(null)}
            />
          )}
        </DnDProvider>
      </ReactFlowProvider>
    </div>
  );
};

export default Flow;