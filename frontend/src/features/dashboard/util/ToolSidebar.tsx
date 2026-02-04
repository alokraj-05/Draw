import { useReactFlow, XYPosition, Position, type Node } from "@xyflow/react";
import { useCallback, useState, ComponentType } from "react";
import { OnDropAction, useDnD, useDnDPosition } from "./useDnD";
import { v4 as uuidv4 } from "uuid";
import { CustomNodeData, NodeVariant, HandleConfig } from "../util/types";
import {
  DoubleHandleNodeIcon,
  FourHandleNodeIcon,
  SingleHandleNodeRIcon,
  GroupHandlNodeIcon,
} from "./icons/Nodes";

const getId = () => uuidv4();

const getDefaultHandles = (variant: NodeVariant): HandleConfig[] => {
  switch (variant) {
    case "single":
      return [{ id: `${getId()}`, type: "source", position: Position.Right }];
    case "double":
      return [
        { id: `${getId()}`, type: "target", position: Position.Left },
        { id: `${getId()}`, type: "source", position: Position.Right },
      ];
    case "quad":
      return [
        { id: `${getId()}`, type: "target", position: Position.Top },
        { id: `${getId()}`, type: "source", position: Position.Right },
        { id: `${getId()}`, type: "source", position: Position.Bottom },
        { id: `${getId()}`, type: "target", position: Position.Left },
      ];
    case "group":
    default:
      return [];
  }
};

// Node variant configurations
const NODE_VARIANTS: {
  variant: NodeVariant;
  label: string;
  icon: ComponentType<any>;
}[] = [
  { variant: "single", label: "Single Handle", icon: SingleHandleNodeRIcon },
  { variant: "double", label: "Double Handle", icon: DoubleHandleNodeIcon },
  { variant: "quad", label: "Quad Handle", icon: FourHandleNodeIcon },
];
const GROUP_VARIANTS: {
  variant: NodeVariant;
  label: string;
  icon: ComponentType<any>;
}[] = [{ variant: "group", label: "Group Node", icon: GroupHandlNodeIcon }];
export function Sidebar() {
  const { onDragStart, isDragging } = useDnD();
  const [draggedVariant, setDraggedVariant] = useState<NodeVariant | null>(
    null,
  );
  const { setNodes, getNodes } = useReactFlow();

  const createAddNewNode = useCallback(
    (variant: NodeVariant): OnDropAction => {
      return ({
        position,
      }: {
        position: XYPosition;
        event?: PointerEvent | MouseEvent;
      }) => {
        const nodes = getNodes();

        // Find if dropping onto a group node
        let parentId: string | undefined = undefined;
        let adjustedPosition = position;

        // Check for group nodes under the drop position
        for (const node of nodes) {
          if (node.type === "group") {
            const nodeWidth = node.width || node.measured?.width || 200;
            const nodeHeight = node.height || node.measured?.height || 200;

            // Check if drop position is within group bounds
            if (
              position.x >= node.position.x &&
              position.x <= node.position.x + nodeWidth &&
              position.y >= node.position.y &&
              position.y <= node.position.y + nodeHeight
            ) {
              parentId = node.id;
              // Convert to relative position within the group
              adjustedPosition = {
                x: position.x - node.position.x,
                y: position.y - node.position.y,
              };
              break;
            }
          }
        }

        const newNode: Node<CustomNodeData> = {
          id: getId(),
          type: `${variant === "group" ? "group" : "customNode"}`,
          position: adjustedPosition,
          parentId,
          extent: parentId ? "parent" : undefined,
          data: {
            label: `${variant} node`,
            variant,
            bgColor: variant === "group" ? "rgba(255,255,255,0.4)" : "#1e1e1e",
            textColor: variant === "group" ? "#000000" : "#ffffff",
            borderColor: "#525252",
            borderWidth: 1,
            borderStyle: "solid",
            handles: getDefaultHandles(variant),
          } as CustomNodeData,
        };

        setNodes((nds) => nds.concat(newNode));
        setDraggedVariant(null);
      };
    },
    [setNodes, getNodes],
  );

  return (
    <>
      {isDragging && draggedVariant && <DragGhost variant={draggedVariant} />}

      <aside
        className="
  absolute top-24 left-3 w-40
  bg-background/80 backdrop-blur-md
  border border-border/60
  rounded-2xl
  shadow-xl shadow-black/10
  select-none
  overflow-hidden
"
      >
        {/* Header */}
        <div className="px-3 py-2 border-b border-border/60">
          <h3 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Nodes
          </h3>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-3 gap-1 p-2">
          {NODE_VARIANTS.map(({ variant, icon: Icon }) => (
            <div
              key={variant}
              className="
          group
          flex items-center justify-center
          w-10 h-10
          rounded-xl
          bg-muted/40
          hover:bg-primary/10
          active:bg-primary/20
          cursor-grab active:cursor-grabbing
          transition-all duration-150
          hover:scale-105 active:scale-95
          shadow-sm
        "
              onPointerDown={(e) => {
                setDraggedVariant(variant);
                onDragStart(e, createAddNewNode(variant));
              }}
            >
              <Icon className="w-5 h-5 text-foreground/80 group-hover:text-primary transition-colors" />
            </div>
          ))}
        </div>

        {/* Group Header */}
        <div className="px-3 py-2 border-t border-border/60 border-b">
          <h3 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Groups
          </h3>
        </div>

        {/* Group Grid */}
        <div className="grid grid-cols-3 gap-1 p-2">
          {GROUP_VARIANTS.map(({ variant, icon: Icon }) => (
            <div
              key={variant}
              className="
          group
          flex items-center justify-center
          w-10 h-10
          rounded-xl
          bg-muted/40
          hover:bg-secondary/20
          active:bg-secondary/30
          cursor-grab active:cursor-grabbing
          transition-all duration-150
          hover:scale-105 active:scale-95
          shadow-sm
        "
              onPointerDown={(e) => {
                setDraggedVariant(variant);
                onDragStart(e, createAddNewNode(variant));
              }}
            >
              <Icon className="w-5 h-5 text-foreground/80 group-hover:text-secondary transition-colors" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-border/60 bg-muted/30">
          <p className="text-[10px] text-muted-foreground leading-snug text-center">
            Drag nodes to canvas or into groups
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

  const variantConfig = NODE_VARIANTS.find((v) => v.variant === variant);
  const Icon = variantConfig?.icon;

  return (
    <div
      className="fixed pointer-events-none z-50 bg-accent border border-border rounded-md px-4 py-2 shadow-lg"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon />}
        <span className="text-sm font-medium">{variantConfig?.label}</span>
      </div>
    </div>
  );
}
