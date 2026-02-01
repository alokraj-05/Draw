/** Resize handle position for selected shapes (rectangle corners/edges, circle radius) */
export type ResizeHandle =
  | 'tl'
  | 'tr'
  | 'bl'
  | 'br'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | null;

/** Viewport for infinite canvas: pan (offset) and zoom */
export type Viewport = {
  offsetX: number;
  offsetY: number;
  zoom: number;
};
