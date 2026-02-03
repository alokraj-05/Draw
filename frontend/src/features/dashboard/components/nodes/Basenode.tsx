import { memo, useState,useEffect,useRef} from "react"
import { NodeProps, NodeResizer, useReactFlow} from "@xyflow/react"
import { getContrastingTextColor } from "../../util/getContrastingTextColor";
export interface BaseNodeProps extends NodeProps{
  data: {
    bgColor?: string,
    label: string
  }
} 


const Basenode = ({ id, data, selected }: BaseNodeProps) => {
  const bgColor = data.bgColor || "#1e1e1e";
  const textColor = getContrastingTextColor(bgColor)
  const { setNodes } = useReactFlow();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
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
        minHeight={25}
      />

      <div className="flex-1 flex items-center justify-center text-xs px-4 py-2 rounded-sm border border-border " style={{background:bgColor, color:textColor}}>
        {editing ? (
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commitChange}
            onKeyDown={(e) => e.key === "Enter" && commitChange()}
            className="border-none outline-none text-center w-auto"
            style={{background:bgColor,color:textColor}}
          />
        ) : (
          data.label
        )}
      </div>
    </div>
  );
};

export default memo(Basenode);