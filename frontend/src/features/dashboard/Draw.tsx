import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { Pencil, Square, Circle, Type, Minus, Eraser, MousePointer, Download, Trash2, Save } from 'lucide-react';
import { updateCanvasData, CanvasData, CanvasTool, Element, DrawElement, RectangleElement, CircleElement, LineElement, TextElement } from './dashboardSlice';
import { updateFile, getSpecificFile } from '@/api/files';

type DrawProps = {
  canvasData?: CanvasData;
};

type ResizeHandle = 'tl' | 'tr' | 'bl' | 'br' | 'top' | 'right' | 'bottom' | 'left' | null;

const Draw = ({ canvasData }: DrawProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize from passed data or defaults
  const [selectedTool, setSelectedTool] = useState<CanvasTool>(canvasData?.appState.selectedTool || 'draw');
  const [elements, setElements] = useState<Element[]>(canvasData?.elements || []);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState<Element | null>(null);
  const [strokeColor, setStrokeColor] = useState(canvasData?.appState.strokeColor || '#ffffff');
  const [fillColor, setFillColor] = useState(canvasData?.appState.fillColor || 'transparent');
  const [strokeWidth, setStrokeWidth] = useState(canvasData?.appState.strokeWidth || 2);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null);
  const selectedFile = useSelector((s: RootState) => s.dashboard.selectedFile);

  // Update Redux when elements change
  useEffect(() => {
    const data: CanvasData = {
      version: '1.0.0',
      appState: {
        zoom: 1,
        offsetX: 0,
        offsetY: 0,
        selectedTool,
        strokeColor,
        fillColor,
        strokeWidth,
        selectedElementId
      },
      elements
    };
    dispatch(updateCanvasData(data));
  }, [elements, selectedTool, strokeColor, fillColor, strokeWidth, selectedElementId, dispatch]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    renderCanvas();
  }, [elements, selectedElementId, currentElement]);

  // Generate unique ID
  const generateId = () => `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Get mouse position
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Check if point is inside element
  const isPointInElement = (x: number, y: number, element: Element): boolean => {
    switch (element.type) {
      case 'rectangle':
        const rect = element as RectangleElement;
        return x >= rect.x && x <= rect.x + rect.width &&
               y >= rect.y && y <= rect.y + rect.height;
      
      case 'circle':
        const circ = element as CircleElement;
        const dist = Math.sqrt(Math.pow(x - circ.x, 2) + Math.pow(y - circ.y, 2));
        return dist <= circ.radius;
      
      case 'line':
        const line = element as LineElement;
        const lineLength = Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2));
        const d1 = Math.sqrt(Math.pow(x - line.x1, 2) + Math.pow(y - line.y1, 2));
        const d2 = Math.sqrt(Math.pow(x - line.x2, 2) + Math.pow(y - line.y2, 2));
        return Math.abs(d1 + d2 - lineLength) < 5;
      
      case 'draw':
        const draw = element as DrawElement;
        return draw.points.some(([px, py]) => 
          Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2)) < 10
        );
      
      default:
        return false;
    }
  };

  // Get resize handle at position
  const getResizeHandleAtPosition = (x: number, y: number, element: Element): ResizeHandle => {
    if (element.type === 'rectangle') {
      const rect = element as RectangleElement;
      const handleSize = 8;
      const handles = {
        tl: { x: rect.x, y: rect.y },
        tr: { x: rect.x + rect.width, y: rect.y },
        bl: { x: rect.x, y: rect.y + rect.height },
        br: { x: rect.x + rect.width, y: rect.y + rect.height },
        top: { x: rect.x + rect.width / 2, y: rect.y },
        right: { x: rect.x + rect.width, y: rect.y + rect.height / 2 },
        bottom: { x: rect.x + rect.width / 2, y: rect.y + rect.height },
        left: { x: rect.x, y: rect.y + rect.height / 2 }
      };

      for (const [handle, pos] of Object.entries(handles)) {
        if (Math.abs(x - pos.x) < handleSize && Math.abs(y - pos.y) < handleSize) {
          return handle as ResizeHandle;
        }
      }
    } else if (element.type === 'circle') {
      const circ = element as CircleElement;
      const handlePos = { x: circ.x + circ.radius, y: circ.y };
      if (Math.abs(x - handlePos.x) < 8 && Math.abs(y - handlePos.y) < 8) {
        return 'right';
      }
    }
    return null;
  };

  // Start drawing/selecting
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);

    // Eraser tool
    if (selectedTool === 'eraser') {
      const elementToDelete = elements.find(el => isPointInElement(pos.x, pos.y, el));
      if (elementToDelete) {
        setElements(elements.filter(el => el.id !== elementToDelete.id));
      }
      return;
    }

    // Select tool
    if (selectedTool === 'select') {
      const selectedElement = elements.find(el => isPointInElement(pos.x, pos.y, el));
      
      if (selectedElement) {
        const handle = getResizeHandleAtPosition(pos.x, pos.y, selectedElement);
        
        if (handle) {
          setIsResizing(true);
          setResizeHandle(handle);
          setSelectedElementId(selectedElement.id);
        } else {
          setIsDragging(true);
          setSelectedElementId(selectedElement.id);
          setDragStart(pos);
        }
      } else {
        setSelectedElementId(null);
      }
      return;
    }

    // Drawing tools
    setIsDrawing(true);

    const baseElement = {
      id: generateId(),
      strokeColor,
      strokeWidth,
      opacity: 1,
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    switch (selectedTool) {
      case 'draw':
        setCurrentElement({
          ...baseElement,
          type: 'draw',
          points: [[pos.x, pos.y]]
        } as DrawElement);
        break;
      case 'rectangle':
        setCurrentElement({
          ...baseElement,
          type: 'rectangle',
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          fillColor,
          rotation: 0
        } as RectangleElement);
        break;
      case 'circle':
        setCurrentElement({
          ...baseElement,
          type: 'circle',
          x: pos.x,
          y: pos.y,
          radius: 0,
          fillColor
        } as CircleElement);
        break;
      case 'line':
        setCurrentElement({
          ...baseElement,
          type: 'line',
          x1: pos.x,
          y1: pos.y,
          x2: pos.x,
          y2: pos.y
        } as LineElement);
        break;
    }
  };

  // Continue drawing/dragging/resizing
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);

    // Handle dragging
    if (isDragging && selectedElementId && dragStart) {
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;

      setElements(elements.map(el => {
        if (el.id !== selectedElementId) return el;

        switch (el.type) {
          case 'rectangle':
            const rect = el as RectangleElement;
            return { ...rect, x: rect.x + dx, y: rect.y + dy };
          case 'circle':
            const circ = el as CircleElement;
            return { ...circ, x: circ.x + dx, y: circ.y + dy };
          case 'line':
            const line = el as LineElement;
            return { ...line, x1: line.x1 + dx, y1: line.y1 + dy, x2: line.x2 + dx, y2: line.y2 + dy };
          case 'draw':
            const draw = el as DrawElement;
            return { ...draw, points: draw.points.map(([x, y]) => [x + dx, y + dy] as [number, number]) };
          default:
            return el;
        }
      }));

      setDragStart(pos);
      return;
    }

    // Handle resizing
    if (isResizing && selectedElementId && resizeHandle) {
      setElements(elements.map(el => {
        if (el.id !== selectedElementId) return el;

        if (el.type === 'rectangle') {
          const rect = el as RectangleElement;
          let newRect = { ...rect };

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
        } else if (el.type === 'circle') {
          const circ = el as CircleElement;
          const radius = Math.sqrt(Math.pow(pos.x - circ.x, 2) + Math.pow(pos.y - circ.y, 2));
          return { ...circ, radius };
        }

        return el;
      }));
      return;
    }

    // Continue drawing
    if (!isDrawing || !currentElement) return;

    switch (currentElement.type) {
      case 'draw':
        setCurrentElement({
          ...currentElement,
          points: [...(currentElement as DrawElement).points, [pos.x, pos.y]]
        });
        break;
      case 'rectangle':
        const rect = currentElement as RectangleElement;
        setCurrentElement({
          ...rect,
          width: pos.x - rect.x,
          height: pos.y - rect.y
        });
        break;
      case 'circle':
        const circ = currentElement as CircleElement;
        const radius = Math.sqrt(Math.pow(pos.x - circ.x, 2) + Math.pow(pos.y - circ.y, 2));
        setCurrentElement({
          ...circ,
          radius
        });
        break;
      case 'line':
        const line = currentElement as LineElement;
        setCurrentElement({
          ...line,
          x2: pos.x,
          y2: pos.y
        });
        break;
    }
  };

  // Finish drawing/dragging/resizing
  const handleMouseUp = () => {
    if (currentElement) {
      setElements([...elements, currentElement]);
      setCurrentElement(null);
    }
    setIsDrawing(false);
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
    setDragStart(null);
  };

  // Delete selected element
  const deleteSelected = () => {
    if (selectedElementId) {
      setElements(elements.filter(el => el.id !== selectedElementId));
      setSelectedElementId(null);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
        e.preventDefault();
        deleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId]);

  // Draw resize handles
  const drawResizeHandles = (ctx: CanvasRenderingContext2D, element: Element) => {
    const handleSize = 8;
    ctx.fillStyle = '#3b82f6';
    ctx.strokeStyle = '#ffffff';
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
        { x: rect.x, y: rect.y + rect.height / 2 }
      ];

      handles.forEach(handle => {
        ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
        ctx.strokeRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
      });
    } else if (element.type === 'circle') {
      const circ = element as CircleElement;
      const handleX = circ.x + circ.radius;
      const handleY = circ.y;
      ctx.fillRect(handleX - handleSize / 2, handleY - handleSize / 2, handleSize, handleSize);
      ctx.strokeRect(handleX - handleSize / 2, handleY - handleSize / 2, handleSize, handleSize);
    }
  };

  // Render canvas
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render all elements
    [...elements, currentElement].filter(Boolean).forEach(element => {
      if (!element || element.isDeleted) return;

      const isSelected = element.id === selectedElementId;

      ctx.strokeStyle = element.strokeColor;
      ctx.lineWidth = element.strokeWidth;
      ctx.globalAlpha = element.opacity;

      // Draw selection outline
      if (isSelected && selectedTool === 'select') {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
      } else {
        ctx.setLineDash([]);
      }

      switch (element.type) {
        case 'draw':
          const draw = element as DrawElement;
          if (draw.points.length < 2) return;
          ctx.beginPath();
          ctx.moveTo(draw.points[0][0], draw.points[0][1]);
          draw.points.forEach(([x, y]) => ctx.lineTo(x, y));
          ctx.stroke();
          break;

        case 'rectangle':
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

        case 'circle':
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

        case 'line':
          const line = element as LineElement;
          ctx.beginPath();
          ctx.moveTo(line.x1, line.y1);
          ctx.lineTo(line.x2, line.y2);
          ctx.stroke();
          break;

        case 'text':
          const text = element as TextElement;
          ctx.font = `${text.fontSize}px ${text.fontFamily}`;
          ctx.fillStyle = text.color;
          ctx.fillText(text.text, text.x, text.y);
          break;
      }

      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // Draw resize handles for selected element
      if (isSelected && selectedTool === 'select') {
        drawResizeHandles(ctx, element);
      }
    });
  };

  // Save to server (update file) - uses selected file from Redux
  const saveToServer = async () => {
    if (!selectedFile || !selectedFile.id) {
      alert('No file selected to save.');
      return;
    }
    const data: CanvasData = {
      version: '1.0.0',
      appState: {
        zoom: 1,
        offsetX: 0,
        offsetY: 0,
        selectedTool,
        strokeColor,
        fillColor,
        strokeWidth,
        selectedElementId: null
      },
      elements
    };
    try {
      // Fetch existing file and merge so we only overwrite canvas-specific parts
      const existing = await getSpecificFile(selectedFile.id);
      const merged = {
        ...existing,
        // preserve existing type/version unless missing
        type: existing?.type ?? 'canvas',
        version: existing?.version ?? data.version,
        // update only canvas-relevant fields
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

  // Export snapshot (PNG) - open image in new tab for printing to PDF if desired
  const exportSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const w = window.open('about:blank');
    if (w) {
      w.document.write(`<img src="${url}" style="width:100%"/>`);
    }
  };

  

  // Clear canvas
  const clearCanvas = () => {
    if (confirm('Clear all elements?')) {
      setElements([]);
    }
  };

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'draw', icon: Pencil, label: 'Draw' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' }
  ];

  return (
    <div className="w-full h-screen flex flex-col bg-[#0a0a0a]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-slate-800">
        {/* Tools */}
        <div className="flex items-center gap-2">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id as CanvasTool)}
              className={`p-2 rounded-lg transition-all ${
                selectedTool === tool.id
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
              title={tool.label}
            >
              <tool.icon size={18} />
            </button>
          ))}
        </div>

        {/* Colors & Options */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">Stroke:</label>
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">Fill:</label>
            <input
              type="color"
              value={fillColor === 'transparent' ? '#000000' : fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <button
              onClick={() => setFillColor('transparent')}
              className="px-2 py-1 text-xs bg-slate-800 text-slate-400 rounded hover:bg-slate-700"
            >
              None
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">Width:</label>
            <input
              type="range"
              min="1"
              max="20"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-xs text-slate-400 w-6">{strokeWidth}</span>
          </div>

          {selectedElementId && (
            <button
              onClick={deleteSelected}
              className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-all"
            >
              Delete Selected
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={saveToServer}
            className="p-2 bg-slate-800/50 text-slate-400 rounded-lg hover:bg-slate-700/50 transition-all"
            title="Save"
          >
            <Save size={18} />
          </button>
          <button
            onClick={exportSnapshot}
            className="p-2 bg-slate-800/50 text-slate-400 rounded-lg hover:bg-slate-700/50 transition-all"
            title="Export Snapshot"
          >
            <Download size={18} />
          </button>
          <button
            onClick={clearCanvas}
            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
            title="Clear Canvas"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex-1"
        style={{ 
          width: '100%', 
          height: '100%',
          cursor: selectedTool === 'select' ? 'default' : selectedTool === 'eraser' ? 'crosshair' : 'crosshair'
        }}
      />

      {/* Stats */}
      <div className="px-4 py-2 bg-[#1a1a1a] border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
        <div>Elements: {elements.length} | Tool: {selectedTool}</div>
        {selectedElementId && (
          <div className="text-blue-400">Selected (Delete/Backspace to remove, Drag to move, Drag handles to resize)</div>
        )}
      </div>
    </div>
  );
};

export default Draw;