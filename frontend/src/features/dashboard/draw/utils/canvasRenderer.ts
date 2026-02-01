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
import type { Viewport } from '../types';
import { RESIZE_HANDLE_SIZE } from './canvasUtils';

const BACKGROUND_COLOR = '#1a1a1a';
const SELECTION_STROKE = '#3b82f6';
const HANDLE_FILL = '#3b82f6';
const HANDLE_STROKE = '#ffffff';

/** Draw resize handles for a selected element */
export function drawResizeHandles(
  ctx: CanvasRenderingContext2D,
  element: Element
): void {
  ctx.fillStyle = HANDLE_FILL;
  ctx.strokeStyle = HANDLE_STROKE;
  ctx.lineWidth = 2;

  if (element.type === 'rectangle') {
    const rect = element as RectangleElement;
    const handles = [
      { x: rect.x, y: rect.y },
      { x: rect.x + rect.width, y: rect.y },
      { x: rect.x, y: rect.y + rect.height },
      { x: rect.x + rect.width, y: rect.y + rect.height },
      { x: rect.x + rect.width / 2, y: rect.y },
      { x: rect.x + rect.width, y: rect.y + rect.height / 2 },
      { x: rect.x + rect.width / 2, y: rect.y + rect.height },
      { x: rect.x, y: rect.y + rect.height / 2 },
    ];

    handles.forEach((handle) => {
      ctx.fillRect(
        handle.x - RESIZE_HANDLE_SIZE / 2,
        handle.y - RESIZE_HANDLE_SIZE / 2,
        RESIZE_HANDLE_SIZE,
        RESIZE_HANDLE_SIZE
      );
      ctx.strokeRect(
        handle.x - RESIZE_HANDLE_SIZE / 2,
        handle.y - RESIZE_HANDLE_SIZE / 2,
        RESIZE_HANDLE_SIZE,
        RESIZE_HANDLE_SIZE
      );
    });
  } else if (element.type === 'circle') {
    const circ = element as CircleElement;
    const handleX = circ.x + circ.radius;
    const handleY = circ.y;
    ctx.fillRect(
      handleX - RESIZE_HANDLE_SIZE / 2,
      handleY - RESIZE_HANDLE_SIZE / 2,
      RESIZE_HANDLE_SIZE,
      RESIZE_HANDLE_SIZE
    );
    ctx.strokeRect(
      handleX - RESIZE_HANDLE_SIZE / 2,
      handleY - RESIZE_HANDLE_SIZE / 2,
      RESIZE_HANDLE_SIZE,
      RESIZE_HANDLE_SIZE
    );
  } else if (element.type === 'diamond' || element.type === 'roundedRect') {
    const rectLike = element as DiamondElement | RoundedRectElement;
    const handles = [
      { x: rectLike.x, y: rectLike.y },
      { x: rectLike.x + rectLike.width, y: rectLike.y },
      { x: rectLike.x, y: rectLike.y + rectLike.height },
      { x: rectLike.x + rectLike.width, y: rectLike.y + rectLike.height },
      { x: rectLike.x + rectLike.width / 2, y: rectLike.y },
      { x: rectLike.x + rectLike.width, y: rectLike.y + rectLike.height / 2 },
      { x: rectLike.x + rectLike.width / 2, y: rectLike.y + rectLike.height },
      { x: rectLike.x, y: rectLike.y + rectLike.height / 2 },
    ];
    handles.forEach((handle) => {
      ctx.fillRect(
        handle.x - RESIZE_HANDLE_SIZE / 2,
        handle.y - RESIZE_HANDLE_SIZE / 2,
        RESIZE_HANDLE_SIZE,
        RESIZE_HANDLE_SIZE
      );
      ctx.strokeRect(
        handle.x - RESIZE_HANDLE_SIZE / 2,
        handle.y - RESIZE_HANDLE_SIZE / 2,
        RESIZE_HANDLE_SIZE,
        RESIZE_HANDLE_SIZE
      );
    });
  }
}

export type RenderCanvasParams = {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  elements: Element[];
  currentElement: Element | null;
  selectedElementId: string | null;
  selectedTool: string;
  viewport?: Viewport | null;
};

/** Draw arrow head at (x2, y2) pointing back along the line */
function drawArrowHead(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  size: number = 12
) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - size * Math.cos(angle - Math.PI / 6), y2 - size * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - size * Math.cos(angle + Math.PI / 6), y2 - size * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

/** Render all elements and selection/handles to the canvas */
export function renderCanvas(params: RenderCanvasParams): void {
  const {
    ctx,
    canvas,
    elements,
    currentElement,
    selectedElementId,
    selectedTool,
    viewport,
  } = params;

  ctx.save();
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (viewport) {
    ctx.setTransform(
      viewport.zoom,
      0,
      0,
      viewport.zoom,
      viewport.offsetX,
      viewport.offsetY
    );
  }

  const toRender = [...elements, currentElement].filter(Boolean) as Element[];

  toRender.forEach((element) => {
    if (element.isDeleted) return;

    const isSelected = element.id === selectedElementId;

    ctx.strokeStyle = element.strokeColor;
    ctx.lineWidth = element.strokeWidth;
    ctx.globalAlpha = element.opacity;

    if (isSelected && selectedTool === 'select') {
      ctx.strokeStyle = SELECTION_STROKE;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
    } else {
      ctx.setLineDash([]);
    }

    switch (element.type) {
      case 'draw': {
        const draw = element as DrawElement;
        if (draw.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(draw.points[0][0], draw.points[0][1]);
        draw.points.forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.stroke();
        break;
      }
      case 'rectangle': {
        const rect = element as RectangleElement;
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.width, rect.height);
        if (rect.fillColor !== 'transparent') {
          ctx.fillStyle = rect.fillColor;
          ctx.fill();
          ctx.strokeStyle = element.strokeColor;
        }
        ctx.stroke();
        break;
      }
      case 'circle': {
        const circ = element as CircleElement;
        ctx.beginPath();
        ctx.arc(circ.x, circ.y, circ.radius, 0, Math.PI * 2);
        if (circ.fillColor !== 'transparent') {
          ctx.fillStyle = circ.fillColor;
          ctx.fill();
          ctx.strokeStyle = element.strokeColor;
        }
        ctx.stroke();
        break;
      }
      case 'line': {
        const line = element as LineElement;
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
        if (line.arrowEnd) {
          ctx.fillStyle = element.strokeColor;
          drawArrowHead(ctx, line.x1, line.y1, line.x2, line.y2);
          ctx.strokeStyle = element.strokeColor;
        }
        break;
      }
      case 'diamond': {
        const d = element as DiamondElement;
        const cx = d.x + d.width / 2;
        const cy = d.y + d.height / 2;
        ctx.beginPath();
        ctx.moveTo(cx, d.y);
        ctx.lineTo(d.x + d.width, cy);
        ctx.lineTo(cx, d.y + d.height);
        ctx.lineTo(d.x, cy);
        ctx.closePath();
        if (d.fillColor !== 'transparent') {
          ctx.fillStyle = d.fillColor;
          ctx.fill();
          ctx.strokeStyle = element.strokeColor;
        }
        ctx.stroke();
        break;
      }
      case 'roundedRect': {
        const rr = element as RoundedRectElement;
        const r = Math.min(rr.cornerRadius, rr.width / 2, rr.height / 2);
        ctx.beginPath();
        ctx.moveTo(rr.x + r, rr.y);
        ctx.lineTo(rr.x + rr.width - r, rr.y);
        ctx.quadraticCurveTo(rr.x + rr.width, rr.y, rr.x + rr.width, rr.y + r);
        ctx.lineTo(rr.x + rr.width, rr.y + rr.height - r);
        ctx.quadraticCurveTo(rr.x + rr.width, rr.y + rr.height, rr.x + rr.width - r, rr.y + rr.height);
        ctx.lineTo(rr.x + r, rr.y + rr.height);
        ctx.quadraticCurveTo(rr.x, rr.y + rr.height, rr.x, rr.y + rr.height - r);
        ctx.lineTo(rr.x, rr.y + r);
        ctx.quadraticCurveTo(rr.x, rr.y, rr.x + r, rr.y);
        ctx.closePath();
        if (rr.fillColor !== 'transparent') {
          ctx.fillStyle = rr.fillColor;
          ctx.fill();
          ctx.strokeStyle = element.strokeColor;
        }
        ctx.stroke();
        break;
      }
      case 'text': {
        const text = element as TextElement;
        ctx.font = `${text.fontSize}px ${text.fontFamily}`;
        ctx.fillStyle = text.color;
        ctx.fillText(text.text, text.x, text.y);
        break;
      }
    }

    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    if (isSelected && selectedTool === 'select') {
      drawResizeHandles(ctx, element);
    }
  });

  ctx.restore();
}
