import { useReactFlow, Edge } from "@xyflow/react";
import { CustomEdgeData, EdgeType } from "../../util/types";
import { useState, useEffect } from "react";
import { Button } from "@/appcomponents/ui/button";
import { Label } from "@/appcomponents/ui/label";
import { Input } from "@/appcomponents/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/appcomponents/ui/select";
import { Switch } from "@/appcomponents/ui/switch";

interface EdgeInspectorProps {
  edgeId: string;
  onClose: () => void;
}

export function EdgeInspector({ edgeId, onClose }: EdgeInspectorProps) {
  const { getEdge, setEdges } = useReactFlow();
  const edge = getEdge(edgeId) as Edge<CustomEdgeData> | undefined;

  const [strokeColor, setStrokeColor] = useState(edge?.data?.strokeColor || "#b1b1b7");
  const [strokeWidth, setStrokeWidth] = useState(edge?.data?.strokeWidth || 2);
  const [animated, setAnimated] = useState(edge?.animated || false);
  const [edgeType, setEdgeType] = useState<EdgeType>((edge?.type as EdgeType) || "default");

  useEffect(() => {
    if (edge) {
      setStrokeColor(edge.data?.strokeColor || "#b1b1b7");
      setStrokeWidth(edge.data?.strokeWidth || 2);
      setAnimated(edge.animated || false);
      setEdgeType((edge.type as EdgeType) || "default");
    }
  }, [edge]);

  if (!edge) return null;

  const updateEdge = (updates: Partial<Edge>) => {
    setEdges((eds) =>
      eds.map((e) =>
        e.id === edgeId
          ? { ...e, ...updates }
          : e
      )
    );
  };

  const updateEdgeData = (dataUpdates: Partial<CustomEdgeData>) => {
    setEdges((eds) =>
      eds.map((e) =>
        e.id === edgeId
          ? { ...e, data: { ...e.data, ...dataUpdates } as CustomEdgeData }
          : e
      )
    );
  };

  return (
    <div className="absolute top-4 right-4 w-80 bg-accent border border-border rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Edge Settings</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>

      {/* Edge Type */}
      <div className="mb-4">
        <Label>Edge Type</Label>
        <Select
          value={edgeType}
          onValueChange={(value: EdgeType) => {
            setEdgeType(value);
            updateEdge({ type: value });
          }}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Bezier</SelectItem>
            <SelectItem value="straight">Straight</SelectItem>
            <SelectItem value="step">Step</SelectItem>
            <SelectItem value="smoothstep">Smooth Step</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stroke Color */}
      <div className="mb-4">
        <Label>Stroke Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            type="color"
            value={strokeColor}
            onChange={(e) => {
              setStrokeColor(e.target.value);
              updateEdgeData({ strokeColor: e.target.value });
              updateEdge({ 
                style: { 
                  ...edge.style, 
                  stroke: e.target.value 
                } 
              });
            }}
            className="w-12 h-10 p-1"
          />
          <Input
            value={strokeColor}
            onChange={(e) => {
              setStrokeColor(e.target.value);
              updateEdgeData({ strokeColor: e.target.value });
              updateEdge({ 
                style: { 
                  ...edge.style, 
                  stroke: e.target.value 
                } 
              });
            }}
            className="flex-1"
          />
        </div>
      </div>

      {/* Stroke Width */}
      <div className="mb-4">
        <Label>Stroke Width</Label>
        <Input
          type="number"
          min="1"
          max="10"
          value={strokeWidth}
          onChange={(e) => {
            const value = Number(e.target.value);
            setStrokeWidth(value);
            updateEdgeData({ strokeWidth: value });
            updateEdge({ 
              style: { 
                ...edge.style, 
                strokeWidth: value 
              } 
            });
          }}
          className="mt-1"
        />
      </div>

      {/* Animated */}
      <div className="flex items-center justify-between mb-4">
        <Label>Animated</Label>
        <Switch
          checked={animated}
          onCheckedChange={(checked) => {
            setAnimated(checked);
            updateEdge({ animated: checked });
            updateEdgeData({ animated: checked });
          }}
        />
      </div>

      {/* Preview */}
      <div className="border border-border rounded p-4 bg-background">
        <Label className="text-xs mb-2 block">Preview</Label>
        <div className="h-12 flex items-center justify-center">
          <svg width="200" height="40">
            <line
              x1="0"
              y1="20"
              x2="200"
              y2="20"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={animated ? "5,5" : "0"}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}