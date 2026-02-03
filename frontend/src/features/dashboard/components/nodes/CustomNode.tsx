import { memo, useState, useEffect, useRef } from "react";
import { NodeProps, NodeResizer, Handle, useReactFlow, Position } from "@xyflow/react";
import { CustomNodeData, HandleConfig } from "../../util/types";
import { getContrastingTextColor } from "../../util/getContrastingTextColor";

// Default handle configurations for each variant
const DEFAULT_HANDLES: Record<string, HandleConfig[]> = {
  single: [
    { id: 'single-1', type: 'source', position: Position.Right }
  ],
  double: [
    { id: 'double-1', type: 'target', position: Position.Left },
    { id: 'double-2', type: 'source', position: Position.Right }
  ],
  quad: [
    { id: 'quad-1', type: 'target', position: Position.Top },
    { id: 'quad-2', type: 'source', position: Position.Right },
    { id: 'quad-3', type: 'source', position: Position.Bottom },
    { id: 'quad-4', type: 'target', position: Position.Left }
  ]
};
type CustomNodeProps = NodeProps & {
  data: CustomNodeData;
};

const CustomNode = ({ id, data, selected }: CustomNodeProps) => {
  const bgColor = data?.bgColor || "#1e1e1e";
  const textColor = data?.textColor || getContrastingTextColor(bgColor);
  const borderColor = data?.borderColor || "#525252";
  const borderWidth = data?.borderWidth || 1;
  const borderStyle = data?.borderStyle || "solid";
  
  const { setNodes } = useReactFlow();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(data?.label || "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Get handles - use custom or default based on variant
  const handles = data?.handles || DEFAULT_HANDLES[data?.variant || 'single'] || [];

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commitChange = () => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: value } }
          : node
      )
    );
    setEditing(false);
  };

  return (
    <div
      className="h-full w-full flex flex-col"
      onDoubleClick={() => setEditing(true)}
    >
      <NodeResizer
        color="#87ceeb"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
      />
      
      <div
        className="flex-1 flex items-center justify-center text-xs px-4 py-2 rounded-sm"
        style={{
          background: bgColor,
          color: textColor,
          border: `${borderWidth}px ${borderStyle} ${borderColor}`,
        }}
      >
        {editing ? (
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commitChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitChange();
              if (e.key === "Escape") {
                setValue(data?.label || "");
                setEditing(false);
              }
            }}
            className="border-none outline-none text-center w-full bg-transparent"
            style={{ color: textColor }}
          />
        ) : (
          data?.label
        )}
      </div>

      {/* Render handles dynamically */}
      {handles.map((handle: HandleConfig) => (
        <Handle
          key={handle.id}
          id={handle.id}
          type={handle.type}
          position={handle.position}
          style={handle.style}
          className={`w-3 h-3 ${
            handle.type === 'source' ? 'bg-blue-500' : 'bg-green-500'
          }`}
        />
      ))}
    </div>
  );
};

export default memo(CustomNode);