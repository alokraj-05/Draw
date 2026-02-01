import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FileMode = 'database' | 'canvas' | 'flow';

// Flow Mode Types
interface Node {
  id: string;
  position: { x: number; y: number };
  data: any;
  type?: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

// Canvas Mode Types
export type CanvasTool =
  | 'select'
  | 'draw'
  | 'rectangle'
  | 'circle'
  | 'line'
  | 'arrow'
  | 'diamond'
  | 'roundedRect'
  | 'text'
  | 'eraser';

export type BaseElement = {
  id: string;
  type: string;
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;
};

export type DrawElement = BaseElement & {
  type: 'draw';
  points: [number, number][];
};

export type RectangleElement = BaseElement & {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
  rotation: number;
};

export type CircleElement = BaseElement & {
  type: 'circle';
  x: number;
  y: number;
  radius: number;
  fillColor: string;
};

export type LineElement = BaseElement & {
  type: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  arrowEnd?: boolean;
};

export type DiamondElement = BaseElement & {
  type: 'diamond';
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
};

export type RoundedRectElement = BaseElement & {
  type: 'roundedRect';
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
  cornerRadius: number;
  rotation: number;
};

export type TextElement = BaseElement & {
  type: 'text';
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
};

export type Element =
  | DrawElement
  | RectangleElement
  | CircleElement
  | LineElement
  | DiamondElement
  | RoundedRectElement
  | TextElement;

export type CanvasAppState = {
  zoom: number;
  offsetX: number;
  offsetY: number;
  selectedTool: CanvasTool;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  selectedElementId: string | null;
};

export type CanvasData = {
  version: string;
  appState: CanvasAppState;
  elements: Element[];
};

export type FlowData = {
  nodes: Node[];
  edges: Edge[];
};

// Union type for mode-specific data
export type ModeData = CanvasData | FlowData | null;

// Unified SelectedFile interface
interface SelectedFile {
  id: string;
  title: string;
  mode: FileMode;
  data: ModeData;
}

interface DashboardState {
  selectedFile: SelectedFile | null;
  isLoading: boolean;
}

const initialState: DashboardState = {
  selectedFile: null,
  isLoading: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSelectedFile: (state, action: PayloadAction<SelectedFile>) => {
      state.selectedFile = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearSelectedFile: (state) => {
      state.selectedFile = null;
    },
    setFileMode: (state, action: PayloadAction<FileMode>) => {
      if (state.selectedFile) {
        state.selectedFile.mode = action.payload;
      }
    },
    updateCanvasData: (state, action: PayloadAction<CanvasData>) => {
      if (state.selectedFile && state.selectedFile.mode === 'canvas') {
        state.selectedFile.data = action.payload;
      }
    },
    updateFlowData: (state, action: PayloadAction<FlowData>) => {
      if (state.selectedFile && state.selectedFile.mode === 'flow') {
        state.selectedFile.data = action.payload;
      }
    },
  },
});

export const { 
  setSelectedFile, 
  setIsLoading, 
  clearSelectedFile, 
  setFileMode,
  updateCanvasData,
  updateFlowData
} = dashboardSlice.actions;
export default dashboardSlice.reducer;