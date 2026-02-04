import { Position } from '@xyflow/react';
import { CSSProperties } from 'react';

// Node types
export type NodeHandleType = 'source' | 'target' ;
export type NodeVariant = 'single' | 'double' | 'quad' | 'group';
export type NodeType = 'group';
// Handle configuration
export interface HandleConfig {
  id: string;
  type: NodeHandleType;
  position: Position;
  style?: CSSProperties;
}

// Node data structure
export interface CustomNodeData extends Record<string, unknown> {
  label: string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  variant: NodeVariant;
  handles?: HandleConfig[];
}

// Edge styling
export type EdgeType = 'default' | 'straight' | 'step' | 'smoothstep';

export interface CustomEdgeData extends Record<string, unknown> {
  strokeColor?: string;
  strokeWidth?: number;
  animated?: boolean;
  edgeType?: EdgeType;
}

// Inspector state
export interface NodeInspectorState {
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
}