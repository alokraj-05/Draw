import { useReactFlow, Node, Position, useUpdateNodeInternals } from "@xyflow/react";
import { CustomNodeData, HandleConfig, NodeHandleType } from "../../util/types";
import { useState, useEffect } from "react";
import { Button } from "@/appcomponents/ui/button";
import { Label } from "@/appcomponents/ui/label";
import { Input } from "@/appcomponents/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/appcomponents/ui/select";
import { v4 as uuidv4 } from 'uuid';

interface NodeInspectorProps {
  nodeId: string;
  onClose: () => void;
}

export function NodeInspector({ nodeId, onClose }: NodeInspectorProps) {
  const updateNodeInternals = useUpdateNodeInternals();
  const { getNode, setNodes } = useReactFlow();
  const node = getNode(nodeId) as Node<CustomNodeData> | undefined;

  const isGroupNode = node?.type === 'group';
  const defaultBgColor = isGroupNode ? 'rgba(255,255,255,0.4)' : '#1e1e1e';
  const defaultTextColor = isGroupNode ? '#000000' : '#ffffff';

  const [label, setLabel] = useState(node?.data.label || "");
  const [bgColor, setBgColor] = useState(node?.data.bgColor || defaultBgColor);
  const [textColor, setTextColor] = useState(node?.data.textColor || defaultTextColor);
  const [borderColor, setBorderColor] = useState(node?.data.borderColor || "#525252");
  const [borderWidth, setBorderWidth] = useState(node?.data.borderWidth || 1);
  const [borderStyle, setBorderStyle] = useState(node?.data.borderStyle || "solid");

  useEffect(() => {
    if (node) {
      const isGroup = node.type === 'group';
      const defBg = isGroup ? 'rgba(255,255,255,0.4)' : '#1e1e1e';
      const defText = isGroup ? '#000000' : '#ffffff';
      
      setLabel(node.data.label);
      setBgColor(node.data.bgColor || defBg);
      setTextColor(node.data.textColor || defText);
      setBorderColor(node.data.borderColor || "#525252");
      setBorderWidth(node.data.borderWidth || 1);
      setBorderStyle(node.data.borderStyle || "solid");
    }
  }, [node]);

  if (!node) return null;

  const updateNode = (updates: Partial<CustomNodeData>) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, ...updates } }
          : n
      )
    );
  };

  const updateHandle = (handleId: string, updates: Partial<HandleConfig>) => {
    const currentHandles = node.data.handles || [];
    const updatedHandles = currentHandles.map((h) =>
      h.id === handleId ? { ...h, ...updates } : h
    );
    updateNode({ handles: updatedHandles });
    updateNodeInternals(nodeId);
  };

  const addHandle = (type: NodeHandleType, position: Position) => {
    const newHandle: HandleConfig = {
      id: uuidv4(),
      type,
      position,
    };
    const currentHandles = node.data.handles || [];
    updateNode({ handles: [...currentHandles, newHandle] });
    updateNodeInternals(nodeId);
  };

  const removeHandle = (handleId: string) => {
    const currentHandles = node.data.handles || [];
    updateNode({ handles: currentHandles.filter(h => h.id !== handleId) });
    updateNodeInternals(nodeId);
  };

  return (
    <div className="absolute top-4 right-4 w-80 bg-accent border border-border rounded-lg shadow-lg p-4 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Node Settings</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>

      {/* Label */}
      <div className="mb-4">
        <Label>Label</Label>
        <Input
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
            updateNode({ label: e.target.value });
          }}
          className="mt-1"
        />
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <Label>Background</Label>
          <div className="flex gap-2 mt-1">
            <Input
              type="color"
              value={bgColor}
              onChange={(e) => {
                setBgColor(e.target.value);
                updateNode({ bgColor: e.target.value });
              }}
              className="w-12 h-10 p-1"
            />
            <Input
              value={bgColor}
              onChange={(e) => {
                setBgColor(e.target.value);
                updateNode({ bgColor: e.target.value });
              }}
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <Label>Text Color</Label>
          <div className="flex gap-2 mt-1">
            <Input
              type="color"
              value={textColor}
              onChange={(e) => {
                setTextColor(e.target.value);
                updateNode({ textColor: e.target.value });
              }}
              className="w-12 h-10 p-1"
            />
            <Input
              value={textColor}
              onChange={(e) => {
                setTextColor(e.target.value);
                updateNode({ textColor: e.target.value });
              }}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Border Settings */}
      <div className="mb-4">
        <Label>Border Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            type="color"
            value={borderColor}
            onChange={(e) => {
              setBorderColor(e.target.value);
              updateNode({ borderColor: e.target.value });
            }}
            className="w-12 h-10 p-1"
          />
          <Input
            value={borderColor}
            onChange={(e) => {
              setBorderColor(e.target.value);
              updateNode({ borderColor: e.target.value });
            }}
            className="flex-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <Label>Border Width</Label>
          <Input
            type="number"
            min="0"
            max="10"
            value={borderWidth}
            onChange={(e) => {
              setBorderWidth(Number(e.target.value));
              updateNode({ borderWidth: Number(e.target.value) });
            }}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Border Style</Label>
          <Select
            value={borderStyle}
            onValueChange={(value: any) => {
              setBorderStyle(value);
              updateNode({ borderStyle: value });
            }}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
              <SelectItem value="dotted">Dotted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Handle Configuration */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Handles ({node.data.variant})</h4>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => addHandle('source', Position.Right)}
            >
              + Output
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addHandle('target', Position.Left)}
            >
              + Input
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          {(node.data.handles || []).map((handle, index) => (
            <div key={handle.id} className="p-3 rounded border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Handle {index + 1}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    handle.type === 'source' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {handle.type === 'source' ? '→ Output' : '← Input'}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeHandle(handle.id)}
                    className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
                  >
                    ✕
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Type</Label>
                  <Select
                    value={handle.type}
                    onValueChange={(value: NodeHandleType) =>
                      updateHandle(handle.id, { type: value })
                    }
                  >
                    <SelectTrigger className="mt-1 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="source">Output</SelectItem>
                      <SelectItem value="target">Input</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Position</Label>
                  <Select
                    value={handle.position}
                    onValueChange={(value: Position) =>
                      updateHandle(handle.id, { position: value })
                    }
                  >
                    <SelectTrigger className="mt-1 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Position.Top}>Top</SelectItem>
                      <SelectItem value={Position.Right}>Right</SelectItem>
                      <SelectItem value={Position.Bottom}>Bottom</SelectItem>
                      <SelectItem value={Position.Left}>Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}