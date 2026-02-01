import type {
  Element,
  DrawElement,
  RectangleElement,
  CircleElement,
  LineElement,
  DiamondElement,
  RoundedRectElement,
  TextElement,
} from '../../dashboardSlice';
import type { ResizeHandle, Viewport } from '../types';

const RESIZE_HANDLE_SIZE = 8;

/** Get world (infinite canvas) position from a mouse event; uses viewport if provided */
export function getMousePos(
  e: React.MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement | null,
  viewport?: Viewport | null
): { x: number; y: number } {
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  const screenX = e.clientX - rect.left;
  const screenY = e.clientY - rect.top;
  if (viewport) {
    return {
      x: (screenX - viewport.offsetX) / viewport.zoom,
      y: (screenY - viewport.offsetY) / viewport.zoom,
    };
  }
  return { x: screenX, y: screenY };
}

/** Check if a point (x, y) is inside the given element */
export function isPointInElement(x: number, y: number, element: Element): boolean {
  switch (element.type) {
    case 'rectangle': {
      const rect = element as RectangleElement;
      return (
        x >= rect.x &&
        x <= rect.x + rect.width &&
        y >= rect.y &&
        y <= rect.y + rect.height
      );
    }
    case 'circle': {
      const circ = element as CircleElement;
      const dist = Math.sqrt(Math.pow(x - circ.x, 2) + Math.pow(y - circ.y, 2));
      return dist <= circ.radius;
    }
    case 'line': {
      const line = element as LineElement;
      const lineLength = Math.sqrt(
        Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2)
      );
      const d1 = Math.sqrt(Math.pow(x - line.x1, 2) + Math.pow(y - line.y1, 2));
      const d2 = Math.sqrt(Math.pow(x - line.x2, 2) + Math.pow(y - line.y2, 2));
      return Math.abs(d1 + d2 - lineLength) < 5;
    }
    case 'draw': {
      const draw = element as DrawElement;
      return draw.points.some(
        ([px, py]) =>
          Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2)) < 10
      );
    }
    case 'diamond': {
      const d = element as DiamondElement;
      const cx = d.x + d.width / 2;
      const cy = d.y + d.height / 2;
      const rx = d.width / 2;
      const ry = d.height / 2;
      const nx = (x - cx) / rx;
      const ny = (y - cy) / ry;
      return Math.abs(nx) + Math.abs(ny) <= 1;
    }
    case 'roundedRect': {
      const rr = element as RoundedRectElement;
      const r = Math.min(rr.cornerRadius, rr.width / 2, rr.height / 2);
      if (x < rr.x || x > rr.x + rr.width || y < rr.y || y > rr.y + rr.height) return false;
      const left = rr.x + r;
      const right = rr.x + rr.width - r;
      const top = rr.y + r;
      const bottom = rr.y + rr.height - r;
      if (x >= left && x <= right && y >= top && y <= bottom) return true;
      const corners: [number, number][] = [
        [left, top],
        [right, top],
        [right, bottom],
        [left, bottom],
      ];
      return corners.some(([cx, cy]) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r);
    }
    case 'text': {
      const text = element as TextElement;
      const approxWidth = text.text.length * text.fontSize * 0.6;
      const top = text.y - text.fontSize;
      return (
        x >= text.x &&
        x <= text.x + approxWidth &&
        y >= top &&
        y <= text.y + text.fontSize * 0.3
      );
    }
    default:
      return false;
  }
}

/** Get the resize handle at (x, y) for the given element, or null */
export function getResizeHandleAtPosition(
  x: number,
  y: number,
  element: Element
): ResizeHandle {
  if (element.type === 'rectangle') {
    const rect = element as RectangleElement;
    const handles: Record<string, { x: number; y: number }> = {
      tl: { x: rect.x, y: rect.y },
      tr: { x: rect.x + rect.width, y: rect.y },
      bl: { x: rect.x, y: rect.y + rect.height },
      br: { x: rect.x + rect.width, y: rect.y + rect.height },
      top: { x: rect.x + rect.width / 2, y: rect.y },
      right: { x: rect.x + rect.width, y: rect.y + rect.height / 2 },
      bottom: { x: rect.x + rect.width / 2, y: rect.y + rect.height },
      left: { x: rect.x, y: rect.y + rect.height / 2 },
    };

    for (const [handle, pos] of Object.entries(handles)) {
      if (
        Math.abs(x - pos.x) < RESIZE_HANDLE_SIZE &&
        Math.abs(y - pos.y) < RESIZE_HANDLE_SIZE
      ) {
        return handle as ResizeHandle;
      }
    }
  } else if (element.type === 'circle') {
    const circ = element as CircleElement;
    const handlePos = { x: circ.x + circ.radius, y: circ.y };
    if (
      Math.abs(x - handlePos.x) < RESIZE_HANDLE_SIZE &&
      Math.abs(y - handlePos.y) < RESIZE_HANDLE_SIZE
    ) {
      return 'right';
    }
  } else if (element.type === 'diamond' || element.type === 'roundedRect') {
    const rectLike = element as DiamondElement | RoundedRectElement;
    const handles: Record<string, { x: number; y: number }> = {
      tl: { x: rectLike.x, y: rectLike.y },
      tr: { x: rectLike.x + rectLike.width, y: rectLike.y },
      bl: { x: rectLike.x, y: rectLike.y + rectLike.height },
      br: { x: rectLike.x + rectLike.width, y: rectLike.y + rectLike.height },
      top: { x: rectLike.x + rectLike.width / 2, y: rectLike.y },
      right: { x: rectLike.x + rectLike.width, y: rectLike.y + rectLike.height / 2 },
      bottom: { x: rectLike.x + rectLike.width / 2, y: rectLike.y + rectLike.height },
      left: { x: rectLike.x, y: rectLike.y + rectLike.height / 2 },
    };
    for (const [handle, pos] of Object.entries(handles)) {
      if (
        Math.abs(x - pos.x) < RESIZE_HANDLE_SIZE &&
        Math.abs(y - pos.y) < RESIZE_HANDLE_SIZE
      ) {
        return handle as ResizeHandle;
      }
    }
  }
  return null;
}

export { RESIZE_HANDLE_SIZE };
