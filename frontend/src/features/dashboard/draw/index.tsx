import { useRef, useEffect } from 'react';
import type { CanvasData } from '../dashboardSlice';
import { useDrawCanvas } from './hooks/useDrawCanvas';
import { DrawToolbar } from './components/DrawToolbar';
import { DrawStatusBar } from './components/DrawStatusBar';
import { ElementPropertyPanel } from './components/ElementPropertyPanel';

export type DrawProps = {
  canvasData?: CanvasData;
};

export function Draw({ canvasData }: DrawProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
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
    editingElementId,
    setEditingElementId,
    editingText,
    setEditingText,
    selectedElementId,
    selectedElement,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    deleteSelected,
    updateSelectedElementProps,
    undo,
    redo,
    canUndo,
    canRedo,
    saveToServer,
    exportSnapshot,
    clearCanvas,
    viewport,
    handleCanvasDoubleClick,
    finalizeTextEdit,
    cancelTextEdit,
  } = useDrawCanvas({ initialCanvasData: canvasData, containerRef });


  useEffect(() => {
    if (editingElementId && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editingElementId]);

  const cursor =
    selectedTool === 'select' ? 'default' : selectedTool === 'eraser' ? 'crosshair' : 'crosshair';

  const handleSelectedStrokeChange = (color: string) => {
    setStrokeColor(color);
    updateSelectedElementProps({ strokeColor: color });
  };
  const handleSelectedFillChange = (color: string) => {
    setFillColor(color);
    updateSelectedElementProps({ fillColor: color });
  };
  const handleSelectedStrokeWidthChange = (width: number) => {
    setStrokeWidth(width);
    updateSelectedElementProps({ strokeWidth: width });
  };
  const handleSelectedTextChange = (text: string) => {
    updateSelectedElementProps({ text });
  };
  const handleSelectedFontFamilyChange = (fontFamily: string) => {
    setFontFamily(fontFamily);
    updateSelectedElementProps({ fontFamily });
  };
  const handleSelectedFontSizeChange = (size: number) => {
    setFontSize(size);
    updateSelectedElementProps({ fontSize: size });
  };
  const handleSelectedTextColorChange = (color: string) => {
    setStrokeColor(color);
    updateSelectedElementProps({ color });
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      finalizeTextEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelTextEdit();
    }
  };

  const handleTextareaBlur = () => {
    finalizeTextEdit();
  };

  const editingElement = editingElementId
    ? elements.find((el) => el.id === editingElementId) || null
    : null;

  const textareaStyle: React.CSSProperties | undefined =
    editingElement && editingElement.type === 'text'
      ? {
          position: 'absolute',
          left: `${editingElement.x * viewport.zoom + viewport.offsetX}px`,
          top: `${editingElement.y * viewport.zoom + viewport.offsetY}px`,
          fontSize: `${editingElement.fontSize * viewport.zoom}px`,
          fontFamily: editingElement.fontFamily,
          color: editingElement.color,
          background: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          outline: 'none',
          resize: 'none',
          padding: '2px',
          minWidth: '100px',
          minHeight: `${editingElement.fontSize * viewport.zoom * 1.2}px`,
          transformOrigin: 'top left',
          pointerEvents: 'auto',
          zIndex: 1000,
        }
      : undefined;

  return (
    <div className="w-full h-screen flex flex-col  relative">
      <DrawToolbar
        selectedTool={selectedTool}
        onToolChange={setSelectedTool}
        strokeColor={strokeColor}
        onStrokeColorChange={setStrokeColor}
        fillColor={fillColor}
        onFillColorChange={setFillColor}
        strokeWidth={strokeWidth}
        onStrokeWidthChange={setStrokeWidth}
        fontFamily={fontFamily}
        onFontFamilyChange={setFontFamily}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        selectedElementId={selectedElementId}
        onDeleteSelected={deleteSelected}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onSave={saveToServer}
        onExport={exportSnapshot}
        onClear={clearCanvas}
      />

      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDoubleClick={handleCanvasDoubleClick}
          className="absolute inset-0 w-full h-full"
          style={{ cursor }}
        />
        {editingElementId && editingElement?.type === 'text' && (
          <textarea
            ref={textareaRef}
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onKeyDown={handleTextareaKeyDown}
            onBlur={handleTextareaBlur}
            style={textareaStyle || {
              position: 'absolute',
              left: '100px',
              top: '100px',
              fontSize: '24px',
              fontFamily: 'Arial',
              color: '#ffffff',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid red',
              outline: 'none',
              resize: 'none',
              padding: '2px',
              minWidth: '100px',
              zIndex: 1000,
            }}
            autoFocus
          />
        )}
        <ElementPropertyPanel
          element={selectedElement}
          onStrokeColorChange={handleSelectedStrokeChange}
          onFillColorChange={handleSelectedFillChange}
          onStrokeWidthChange={handleSelectedStrokeWidthChange}
          onTextChange={handleSelectedTextChange}
          onFontFamilyChange={handleSelectedFontFamilyChange}
          onFontSizeChange={handleSelectedFontSizeChange}
          onTextColorChange={handleSelectedTextColorChange}
        />
      </div>

      <DrawStatusBar
        elementCount={elements.length}
        selectedTool={selectedTool}
        selectedElementId={selectedElementId}
      />
    </div>
  );
}

export default Draw;