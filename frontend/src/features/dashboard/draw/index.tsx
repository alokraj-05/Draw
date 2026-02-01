import { useRef } from 'react';
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
  } = useDrawCanvas({ initialCanvasData: canvasData, containerRef });

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

  return (
    <div className="w-full h-screen flex flex-col bg-[#0a0a0a] relative">
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
          className="absolute inset-0 w-full h-full"
          style={{ cursor }}
        />
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
