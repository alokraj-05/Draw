import { memo, useState, useRef, useEffect } from "react";
import { NodeResizer, useReactFlow, Handle, Position } from "@xyflow/react";
import { CustomNodeProps } from "./CustomNode";
import { getContrastingTextColor } from "../../util/getContrastingTextColor";
import { HandleConfig } from "../../util/types";

const SubFlow = ({id,data,selected}:CustomNodeProps) =>{
  const bgColor = data?.bgColor || 'rgba(255,255,255,0.4)';
  const textColor = data?.textColor || getContrastingTextColor(bgColor);
  const borderColor = data?.borderColor || '#525252';
  const borderWidth = data?.borderWidth || 1;
  const borderStyle = data?.borderStyle || "solid";

  const { setNodes } = useReactFlow();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(data?.label || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const handles = data?.handles || [];

  // Group handles by position
  const handlesByPosition = handles.reduce((acc, handle) => {
    if (!acc[handle.position]) acc[handle.position] = [];
    acc[handle.position].push(handle);
    return acc;
  }, {} as Record<Position, HandleConfig[]>);

  // Calculate handle styles with spacing
  const getHandleStyle = (handle: HandleConfig, index: number, total: number) => {
    const baseStyle = { ...handle.style };
    const gap = 20; // pixels between handles
    const offset = (total - 1) * gap / 2; // center the group
    const positionOffset = index * gap - offset;

    switch (handle.position) {
      case Position.Top:
        baseStyle.top = '0';
        baseStyle.left = `calc(50% + ${positionOffset}px)`;
        baseStyle.transform = 'translateX(-50%)';
        break;
      case Position.Bottom:
        baseStyle.bottom = '0';
        baseStyle.left = `calc(50% + ${positionOffset}px)`;
        baseStyle.transform = 'translateX(-50%)';
        break;
      case Position.Left:
        baseStyle.left = '0';
        baseStyle.top = `calc(50% + ${positionOffset}px)`;
        baseStyle.transform = 'translateY(-50%)';
        break;
      case Position.Right:
        baseStyle.right = '0';
        baseStyle.top = `calc(50% + ${positionOffset}px)`;
        baseStyle.transform = 'translateY(-50%)';
        break;
    }
    return baseStyle;
  };

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
      onDoubleClick={()=> setEditing(true)}
      style={{
        backgroundColor: bgColor,
        border: `${borderWidth}px ${borderStyle} ${borderColor}`,
        borderRadius: '4px',
        boxSizing: 'border-box'
      }}
    >
      <NodeResizer 
        color="#87ceeb"
        isVisible={selected}
        minWidth={200}
        minHeight={200}
      />
      
      <div
        className="flex-1 flex items-center justify-center text-xs rounded-sm px-4 py-20"
        style={{
          color: textColor,
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

      {/* Render handles with spacing */}
      {Object.entries(handlesByPosition).map(([_, positionHandles]) =>
        positionHandles.map((handle, index) => (
          <Handle
            key={handle.id}
            id={handle.id}
            type={handle.type}
            position={handle.position as Position}
            style={getHandleStyle(handle, index, positionHandles.length)}
            className={`w-3 h-3 ${
              handle.type === 'source' ? 'bg-blue-500' : 'bg-green-500'
            }`}
          />
        ))
      )}
    </div>
  )
}

export default memo(SubFlow);