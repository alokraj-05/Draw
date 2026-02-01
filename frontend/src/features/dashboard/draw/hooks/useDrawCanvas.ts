import { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import {
  updateCanvasData,
  CanvasData,
  CanvasTool,
  Element,
  DrawElement,
  RectangleElement,
  CircleElement,
  LineElement,
  DiamondElement,
  RoundedRectElement,
  TextElement,
} from '../../dashboardSlice';
import { updateFile, getSpecificFile } from '@/api/files';
import { getMousePos, isPointInElement, getResizeHandleAtPosition } from '../utils/canvasUtils';
import { renderCanvas } from '../utils/canvasRenderer';
import type { ResizeHandle, Viewport } from '../types';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.1;
const HISTORY_LIMIT = 50;

export type UseDrawCanvasProps = {
  initialCanvasData?: CanvasData | null;
  /** Ref for the canvas container (for non-passive wheel zoom). Pass the div that wraps the canvas. */
  containerRef?: React.RefObject<HTMLDivElement | null>;
};

function generateId() {
  return `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function createBaseElement(): Pick<Element, 'strokeColor' | 'strokeWidth' | 'opacity' | 'isDeleted' | 'createdAt' | 'updatedAt'> {
  return {
    strokeColor: '#ffffff',
    strokeWidth: 2,
    opacity: 1,
    isDeleted: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function useDrawCanvas(props: UseDrawCanvasProps = {}) {
  const { initialCanvasData, containerRef } = props;
  const dispatch = useDispatch<AppDispatch>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectedFile = useSelector((s: RootState) => s.dashboard.selectedFile);

  const [selectedTool, setSelectedTool] = useState<CanvasTool>(
    initialCanvasData?.appState.selectedTool || 'draw'
  );
  const [elements, setElements] = useState<Element[]>(initialCanvasData?.elements || []);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState<Element | null>(null);
  const [strokeColor, setStrokeColor] = useState(
    initialCanvasData?.appState.strokeColor || '#ffffff'
  );
  const [fillColor, setFillColor] = useState(
    initialCanvasData?.appState.fillColor || 'transparent'
  );
  const [strokeWidth, setStrokeWidth] = useState(
    initialCanvasData?.appState.strokeWidth || 2
  );
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(24);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    initialCanvasData?.appState.selectedElementId ?? null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null);

  // Undo/redo history
  const [past, setPast] = useState<Element[][]>([]);
  const [future, setFuture] = useState<Element[][]>([]);
  const isUndoRedoRef = useRef(false);

  // Viewport (infinite canvas)
  const [viewport, setViewport] = useState<Viewport>({
    offsetX: initialCanvasData?.appState.offsetX ?? 0,
    offsetY: initialCanvasData?.appState.offsetY ?? 0,
    zoom: initialCanvasData?.appState.zoom ?? 1,
  });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ worldX: number; worldY: number } | null>(null);
  const spacePressedRef = useRef(false);
  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;

  const recordHistory = useCallback(() => {
    if (isUndoRedoRef.current) return;
    setPast((prev) => {
      const next = [...prev, elements];
      return next.length > HISTORY_LIMIT ? next.slice(-HISTORY_LIMIT) : next;
    });
    setFuture([]);
  }, [elements]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    isUndoRedoRef.current = true;
    const previous = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [...f, elements]);
    setElements(previous);
    setTimeout(() => {
      isUndoRedoRef.current = false;
    }, 0);
  }, [past, elements]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    isUndoRedoRef.current = true;
    const next = future[future.length - 1];
    setFuture((f) => f.slice(0, -1));
    setPast((p) => [...p, elements]);
    setElements(next);
    setTimeout(() => {
      isUndoRedoRef.current = false;
    }, 0);
  }, [future, elements]);

  // Sync to Redux when canvas state changes
  useEffect(() => {
    const data: CanvasData = {
      version: '1.0.0',
      appState: {
        zoom: viewport.zoom,
        offsetX: viewport.offsetX,
        offsetY: viewport.offsetY,
        selectedTool,
        strokeColor,
        fillColor,
        strokeWidth,
        selectedElementId,
      },
      elements,
    };
    dispatch(updateCanvasData(data));
  }, [elements, selectedTool, strokeColor, fillColor, strokeWidth, selectedElementId, viewport, dispatch]);

  // Resize canvas and re-render when dependencies change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderCanvas({
      ctx,
      canvas,
      elements,
      currentElement,
      selectedElementId,
      selectedTool,
      viewport,
    });
  }, [elements, selectedElementId, currentElement, selectedTool, viewport]);

  // Keyboard: delete, undo, redo, space for pan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        spacePressedRef.current = true;
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) redo();
          else undo();
        } else if (e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
        e.preventDefault();
        deleteSelected();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        spacePressedRef.current = false;
        setIsPanning(false);
        panStartRef.current = null;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedElementId, undo, redo]);

  function deleteSelected() {
    if (selectedElementId) {
      recordHistory();
      setElements((prev) => prev.filter((el) => el.id !== selectedElementId));
      setSelectedElementId(null);
    }
  }

  const updateSelectedElementProps = useCallback(
    (props: {
      strokeColor?: string;
      fillColor?: string;
      strokeWidth?: number;
      fontFamily?: string;
      fontSize?: number;
      text?: string;
      color?: string;
    }) => {
      if (!selectedElementId) return;
      recordHistory();
      setElements((prev) =>
        prev.map((el) => {
          if (el.id !== selectedElementId) return el;
          const next = { ...el };
          if (props.strokeColor !== undefined) next.strokeColor = props.strokeColor;
          if (props.strokeWidth !== undefined) next.strokeWidth = props.strokeWidth;
          if ('fillColor' in next && props.fillColor !== undefined) (next as { fillColor: string }).fillColor = props.fillColor;
          if (el.type === 'text') {
            const textEl = next as TextElement;
            if (props.fontFamily !== undefined) textEl.fontFamily = props.fontFamily;
            if (props.fontSize !== undefined) textEl.fontSize = props.fontSize;
            if (props.text !== undefined) textEl.text = props.text;
            if (props.color !== undefined) textEl.color = props.color;
          }
          return next;
        })
      );
    },
    [selectedElementId, recordHistory]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const v = viewportRef.current;
      const worldX = (screenX - v.offsetX) / v.zoom;
      const worldY = (screenY - v.offsetY) / v.zoom;
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.zoom + delta));
      const newOffsetX = screenX - worldX * newZoom;
      const newOffsetY = screenY - worldY * newZoom;
      setViewport((prev) => ({ ...prev, zoom: newZoom, offsetX: newOffsetX, offsetY: newOffsetY }));
    },
    []
  );

  // Non-passive wheel listener so preventDefault() works and scroll-to-zoom works
  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const v = viewportRef.current;
      const worldX = (screenX - v.offsetX) / v.zoom;
      const worldY = (screenY - v.offsetY) / v.zoom;
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.zoom + delta));
      setViewport((prev) => ({
        ...prev,
        zoom: newZoom,
        offsetX: screenX - worldX * newZoom,
        offsetY: screenY - worldY * newZoom,
      }));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [containerRef]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const screenX = canvas ? e.clientX - canvas.getBoundingClientRect().left : 0;
    const screenY = canvas ? e.clientY - canvas.getBoundingClientRect().top : 0;
    const pos = getMousePos(e, canvas, viewport);

    if (e.button === 1 || (e.button === 0 && spacePressedRef.current)) {
      setIsPanning(true);
      const worldX = (screenX - viewport.offsetX) / viewport.zoom;
      const worldY = (screenY - viewport.offsetY) / viewport.zoom;
      panStartRef.current = { worldX, worldY };
      return;
    }
    if (e.button !== 0) return;

    if (selectedTool === 'eraser') {
      const elementToDelete = elements.find((el) => isPointInElement(pos.x, pos.y, el));
      if (elementToDelete) {
        setElements((prev) => prev.filter((el) => el.id !== elementToDelete.id));
      }
      return;
    }

    if (selectedTool === 'text') {
      const userText = window.prompt('Enter text:', 'Text');
      if (userText != null && userText.trim() !== '') {
        recordHistory();
        const base = { ...createBaseElement(), id: generateId(), strokeColor, strokeWidth };
        const textEl: TextElement = {
          ...base,
          type: 'text',
          x: pos.x,
          y: pos.y,
          text: userText.trim(),
          fontSize,
          fontFamily,
          color: strokeColor,
        };
        setElements((prev) => [...prev, textEl]);
      }
      return;
    }

    if (selectedTool === 'select') {
      const selectedElement = elements.find((el) => isPointInElement(pos.x, pos.y, el));
      if (selectedElement) {
        const handle = getResizeHandleAtPosition(pos.x, pos.y, selectedElement);
        if (handle) {
          recordHistory();
          setIsResizing(true);
          setResizeHandle(handle);
          setSelectedElementId(selectedElement.id);
        } else {
          recordHistory();
          setIsDragging(true);
          setSelectedElementId(selectedElement.id);
          setDragStart(pos);
        }
      } else {
        setSelectedElementId(null);
      }
      return;
    }

    setIsDrawing(true);
    const base = { ...createBaseElement(), id: generateId(), strokeColor, strokeWidth };

    switch (selectedTool) {
      case 'draw':
        setCurrentElement({
          ...base,
          type: 'draw',
          points: [[pos.x, pos.y]],
        } as DrawElement);
        break;
      case 'rectangle':
        setCurrentElement({
          ...base,
          type: 'rectangle',
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          fillColor,
          rotation: 0,
        } as RectangleElement);
        break;
      case 'circle':
        setCurrentElement({
          ...base,
          type: 'circle',
          x: pos.x,
          y: pos.y,
          radius: 0,
          fillColor,
        } as CircleElement);
        break;
      case 'line':
      case 'arrow':
        setCurrentElement({
          ...base,
          type: 'line',
          x1: pos.x,
          y1: pos.y,
          x2: pos.x,
          y2: pos.y,
          arrowEnd: selectedTool === 'arrow',
        } as LineElement);
        break;
      case 'diamond':
        setCurrentElement({
          ...base,
          type: 'diamond',
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          fillColor,
        } as DiamondElement);
        break;
      case 'roundedRect':
        setCurrentElement({
          ...base,
          type: 'roundedRect',
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          fillColor,
          cornerRadius: 12,
          rotation: 0,
        } as RoundedRectElement);
        break;
      default:
        break;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const pos = getMousePos(e, canvas, viewport);
    const screenX = canvas ? e.clientX - canvas.getBoundingClientRect().left : 0;
    const screenY = canvas ? e.clientY - canvas.getBoundingClientRect().top : 0;

    if (isPanning && panStartRef.current) {
      const { worldX, worldY } = panStartRef.current;
      setViewport((v) => ({
        ...v,
        offsetX: screenX - worldX * v.zoom,
        offsetY: screenY - worldY * v.zoom,
      }));
      return;
    }

    if (isDragging && selectedElementId && dragStart) {
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;
      setElements((prev) =>
        prev.map((el) => {
          if (el.id !== selectedElementId) return el;
          switch (el.type) {
            case 'rectangle': {
              const rect = el as RectangleElement;
              return { ...rect, x: rect.x + dx, y: rect.y + dy };
            }
            case 'circle': {
              const circ = el as CircleElement;
              return { ...circ, x: circ.x + dx, y: circ.y + dy };
            }
            case 'line': {
              const line = el as LineElement;
              return {
                ...line,
                x1: line.x1 + dx,
                y1: line.y1 + dy,
                x2: line.x2 + dx,
                y2: line.y2 + dy,
              };
            }
            case 'draw': {
              const draw = el as DrawElement;
              return {
                ...draw,
                points: draw.points.map(([x, y]) => [x + dx, y + dy] as [number, number]),
              };
            }
            case 'diamond': {
              const d = el as DiamondElement;
              return { ...d, x: d.x + dx, y: d.y + dy };
            }
            case 'roundedRect': {
              const rr = el as RoundedRectElement;
              return { ...rr, x: rr.x + dx, y: rr.y + dy };
            }
            case 'text': {
              const text = el as TextElement;
              return { ...text, x: text.x + dx, y: text.y + dy };
            }
            default:
              return el;
          }
        })
      );
      setDragStart(pos);
      return;
    }

    if (isResizing && selectedElementId && resizeHandle) {
      setElements((prev) =>
        prev.map((el) => {
          if (el.id !== selectedElementId) return el;
          if (el.type === 'rectangle') {
            const rect = el as RectangleElement;
            const newRect = { ...rect };
            switch (resizeHandle) {
              case 'br':
                newRect.width = pos.x - rect.x;
                newRect.height = pos.y - rect.y;
                break;
              case 'tl':
                newRect.width = rect.width + (rect.x - pos.x);
                newRect.height = rect.height + (rect.y - pos.y);
                newRect.x = pos.x;
                newRect.y = pos.y;
                break;
              case 'tr':
                newRect.width = pos.x - rect.x;
                newRect.height = rect.height + (rect.y - pos.y);
                newRect.y = pos.y;
                break;
              case 'bl':
                newRect.width = rect.width + (rect.x - pos.x);
                newRect.height = pos.y - rect.y;
                newRect.x = pos.x;
                break;
            }
            return newRect;
          }
          if (el.type === 'circle') {
            const circ = el as CircleElement;
            const radius = Math.sqrt(
              Math.pow(pos.x - circ.x, 2) + Math.pow(pos.y - circ.y, 2)
            );
            return { ...circ, radius };
          }
          if (el.type === 'diamond') {
            const d = el as DiamondElement;
            const newRect = { ...d };
            switch (resizeHandle) {
              case 'br':
                newRect.width = pos.x - d.x;
                newRect.height = pos.y - d.y;
                break;
              case 'tl':
                newRect.width = d.width + (d.x - pos.x);
                newRect.height = d.height + (d.y - pos.y);
                newRect.x = pos.x;
                newRect.y = pos.y;
                break;
              case 'tr':
                newRect.width = pos.x - d.x;
                newRect.height = d.height + (d.y - pos.y);
                newRect.y = pos.y;
                break;
              case 'bl':
                newRect.width = d.width + (d.x - pos.x);
                newRect.height = pos.y - d.y;
                newRect.x = pos.x;
                break;
            }
            return newRect;
          }
          if (el.type === 'roundedRect') {
            const rr = el as RoundedRectElement;
            const newRect = { ...rr };
            switch (resizeHandle) {
              case 'br':
                newRect.width = pos.x - rr.x;
                newRect.height = pos.y - rr.y;
                break;
              case 'tl':
                newRect.width = rr.width + (rr.x - pos.x);
                newRect.height = rr.height + (rr.y - pos.y);
                newRect.x = pos.x;
                newRect.y = pos.y;
                break;
              case 'tr':
                newRect.width = pos.x - rr.x;
                newRect.height = rr.height + (rr.y - pos.y);
                newRect.y = pos.y;
                break;
              case 'bl':
                newRect.width = rr.width + (rr.x - pos.x);
                newRect.height = pos.y - rr.y;
                newRect.x = pos.x;
                break;
            }
            return newRect;
          }
          return el;
        })
      );
      return;
    }

    if (!isDrawing || !currentElement) return;

    switch (currentElement.type) {
      case 'draw':
        setCurrentElement({
          ...currentElement,
          points: [...(currentElement as DrawElement).points, [pos.x, pos.y]],
        });
        break;
      case 'rectangle': {
        const rect = currentElement as RectangleElement;
        setCurrentElement({
          ...rect,
          width: pos.x - rect.x,
          height: pos.y - rect.y,
        });
        break;
      }
      case 'diamond': {
        const d = currentElement as DiamondElement;
        setCurrentElement({
          ...d,
          width: pos.x - d.x,
          height: pos.y - d.y,
        });
        break;
      }
      case 'roundedRect': {
        const rr = currentElement as RoundedRectElement;
        setCurrentElement({
          ...rr,
          width: pos.x - rr.x,
          height: pos.y - rr.y,
        });
        break;
      }
      case 'circle': {
        const circ = currentElement as CircleElement;
        const radius = Math.sqrt(
          Math.pow(pos.x - circ.x, 2) + Math.pow(pos.y - circ.y, 2)
        );
        setCurrentElement({ ...circ, radius });
        break;
      }
      case 'line': {
        const line = currentElement as LineElement;
        setCurrentElement({ ...line, x2: pos.x, y2: pos.y });
        break;
      }
      default:
        break;
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      panStartRef.current = null;
      return;
    }
    if (currentElement) {
      recordHistory();
      setElements((prev) => [...prev, currentElement]);
      setCurrentElement(null);
    }
    setIsDrawing(false);
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
    setDragStart(null);
  };

  const saveToServer = async () => {
    if (!selectedFile?.id) {
      alert('No file selected to save.');
      return;
    }
    const data: CanvasData = {
      version: '1.0.0',
      appState: {
        zoom: viewport.zoom,
        offsetX: viewport.offsetX,
        offsetY: viewport.offsetY,
        selectedTool,
        strokeColor,
        fillColor,
        strokeWidth,
        selectedElementId: null,
      },
      elements,
    };
    try {
      const existing = await getSpecificFile(selectedFile.id);
      const merged = {
        ...existing,
        type: existing?.type ?? 'canvas',
        version: existing?.version ?? data.version,
        appState: data.appState,
        elements: data.elements,
      };
      await updateFile(selectedFile.id, merged);
      alert('Saved to drive');
    } catch (err) {
      console.error(err);
      alert('Failed to save');
    }
  };

  const exportSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const w = window.open('about:blank');
    if (w) {
      w.document.write(`<img src="${url}" style="width:100%"/>`);
    }
  };

  const clearCanvas = () => {
    if (confirm('Clear all elements?')) {
      recordHistory();
      setElements([]);
    }
  };

  const selectedElement = selectedElementId
    ? elements.find((el) => el.id === selectedElementId) ?? null
    : null;

  return {
    canvasRef,
    selectedTool,
    setSelectedTool,
    elements,
    strokeColor,
    setStrokeColor,
    fillColor,
    setFillColor,
    strokeWidth,
    setStrokeWidth,
    fontFamily,
    setFontFamily,
    fontSize,
    setFontSize,
    selectedElementId,
    selectedElement,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    deleteSelected,
    updateSelectedElementProps,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    saveToServer,
    exportSnapshot,
    clearCanvas,
  };
}
