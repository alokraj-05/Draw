import { useReactFlow, XYPosition, Position, type Node } from "@xyflow/react";
import { useCallback, useState, ComponentType } from "react";
import { OnDropAction, useDnD, useDnDPosition } from "./useDnD";
import { v4 as uuidv4 } from 'uuid';
import { CustomNodeData, NodeVariant,HandleConfig } from "../util/types";
import { DoubleHandleNodeIcon, FourHandleNodeIcon, SingleHandleNodeRIcon } from "./icons/Nodes";
const getId = () => uuidv4();

const getDefaultHandles = (variant: NodeVariant): HandleConfig[] => {
  switch (variant) {
    case 'single':
      return [
        { id: `${getId()}`, type: 'source', position: Position.Right }
      ];
    case 'double':
      return [
        { id: `${getId()}`, type: 'target', position: Position.Left },
        { id: `${getId()}`, type: 'source', position: Position.Right }
      ];
    case 'quad':
      return [
        { id: `${getId()}`, type: 'target', position: Position.Top },
        { id: `${getId()}`, type: 'source', position: Position.Right },
        { id: `${getId()}`, type: 'source', position: Position.Bottom },
        { id: `${getId()}`, type: 'target', position: Position.Left }
      ];
    default:
      return [];
  }
};
// Node variant configurations
const NODE_VARIANTS: { variant: NodeVariant; label: string; icon: ComponentType<any> }[] = [
  { variant: 'single', label: 'Single Handle', icon: SingleHandleNodeRIcon },
  { variant: 'double', label: 'Double Handle', icon: DoubleHandleNodeIcon },
  { variant: 'quad', label: 'Quad Handle', icon: FourHandleNodeIcon },
];


export function Sidebar() {
  const { onDragStart, isDragging } = useDnD();
  const [draggedVariant, setDraggedVariant] = useState<NodeVariant | null>(null);
  const { setNodes } = useReactFlow();

  const createAddNewNode = useCallback(
    (variant: NodeVariant): OnDropAction => {
      return ({ position }: { position: XYPosition }) => {
        const newNode: Node<CustomNodeData> = {
          id: getId(),
          type: 'customNode',
          position,
          data: {
            label: `${variant} node`,
            variant,
            bgColor: '#1e1e1e',
            textColor: '#ffffff',
            borderColor: '#525252',
            borderWidth: 1,
            borderStyle: 'solid',
            handles: getDefaultHandles(variant)
          } as CustomNodeData,
        };
        setNodes((nds) => nds.concat(newNode));
        setDraggedVariant(null);
      };
    },
    [setNodes]
  );

return (
  <>
    {isDragging && draggedVariant && <DragGhost variant={draggedVariant} />}

    <aside className="absolute top-30 left-2 w-36 bg-accent border border-border rounded-xl shadow-lg select-none">
      {/* Header */}
      <div className="px-3 py-1 border-b border-border">
        <h3 className="text-sm font-semibold">Nodes</h3>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 p-1">
        {NODE_VARIANTS.map(({ variant, icon: Icon }) => (
          <div
            key={variant}
            className="
              flex items-center justify-center
              w-8 h-8
              rounded-md
              hover:bg-accent-foreground/10
              cursor-grab active:cursor-grabbing
              transition-colors
            "
            onPointerDown={(e) => {
              setDraggedVariant(variant);
              onDragStart(e, createAddNewNode(variant));
            }}
          >
            <Icon />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-border text-center">
        <p className="text-[10px] text-muted-foreground leading-tight">
          Drag nodes to canvas, then select to customize
        </p>
      </div>
    </aside>
  </>
);

}

interface DragGhostProps {
  variant: NodeVariant;
}

export function DragGhost({ variant }: DragGhostProps) {
  const { position } = useDnDPosition();
  
  if (!position) return null;

  const variantConfig = NODE_VARIANTS.find(v => v.variant === variant);
  const Icon = variantConfig?.icon;

  return (
    <div
      className="fixed pointer-events-none z-50 bg-accent border border-border rounded-md px-4 py-2 shadow-lg"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon />}
        <span className="text-sm font-medium">{variantConfig?.label}</span>
      </div>
    </div>
  );
}