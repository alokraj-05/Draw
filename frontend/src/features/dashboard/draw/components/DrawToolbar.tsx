import {
  Pencil,
  Square,
  Circle,
  Type,
  Minus,
  Eraser,
  MousePointer,
  Download,
  Trash2,
  Save,
  Undo2,
  Redo2,
  ArrowRight,
  Gem,
  SquareRoundCorner,
} from 'lucide-react';
import type { CanvasTool } from '../../dashboardSlice';

const TOOLS: { id: CanvasTool; icon: React.ComponentType<{ size?: number }>; label: string }[] = [
  { id: 'select', icon: MousePointer, label: 'Select' },
  { id: 'draw', icon: Pencil, label: 'Draw' },
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'line', icon: Minus, label: 'Line' },
  { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
  { id: 'diamond', icon: Gem, label: 'Diamond (decision)' },
  { id: 'roundedRect', icon: SquareRoundCorner, label: 'Rounded rectangle' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'eraser', icon: Eraser, label: 'Eraser' },
];

export const FONT_OPTIONS: { value: string; label: string }[] = [
  { value: 'Arial', label: 'Arial (Sans)' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Georgia', label: 'Georgia (Serif)' },
  { value: 'Times New Roman', label: 'Times (Serif)' },
  { value: 'Courier New', label: 'Courier (Monospace)' },
  { value: 'Comic Sans MS', label: 'Comic Sans (Cursive)' },
  { value: 'Brush Script MT', label: 'Brush Script (Cursive)' },
  { value: 'Impact', label: 'Impact (Display)' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
];

export type DrawToolbarProps = {
  selectedTool: CanvasTool;
  onToolChange: (tool: CanvasTool) => void;
  strokeColor: string;
  onStrokeColorChange: (color: string) => void;
  fillColor: string;
  onFillColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  fontFamily: string;
  onFontFamilyChange: (font: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  selectedElementId: string | null;
  onDeleteSelected: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onSave: () => void;
  onExport: () => void;
  onClear: () => void;
};

export function DrawToolbar({
  selectedTool,
  onToolChange,
  strokeColor,
  onStrokeColorChange,
  fillColor,
  onFillColorChange,
  strokeWidth,
  onStrokeWidthChange,
  fontFamily,
  onFontFamilyChange,
  fontSize,
  onFontSizeChange,
  selectedElementId,
  onDeleteSelected,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSave,
  onExport,
  onClear,
}: DrawToolbarProps) {
  return (
    <div className="flex items-center justify-between px-14 py-3 bg-[#1a1a1a] border-b border-slate-800">
      {/* Undo/Redo + Tools */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 border-r border-slate-700 pr-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 disabled:hover:bg-slate-800/50"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={18} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 disabled:hover:bg-slate-800/50"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
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
      </div>

      {/* Colors & Options */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Stroke:</label>
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => onStrokeColorChange(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Fill:</label>
          <input
            type="color"
            value={fillColor === 'transparent' ? '#000000' : fillColor}
            onChange={(e) => onFillColorChange(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
          />
          <button
            onClick={() => onFillColorChange('transparent')}
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
            onChange={(e) => onStrokeWidthChange(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-xs text-slate-400 w-6">{strokeWidth}</span>
        </div>

        {selectedTool === 'text' && (
          <>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">Font:</label>
              <select
                value={fontFamily}
                onChange={(e) => onFontFamilyChange(e.target.value)}
                className="rounded bg-slate-800 text-slate-300 text-xs px-2 py-1.5 border border-slate-600 min-w-35"
              >
                {FONT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">Size:</label>
              <input
                type="number"
                min="8"
                max="120"
                value={fontSize}
                onChange={(e) => onFontSizeChange(Number(e.target.value) || 24)}
                className="w-14 rounded bg-slate-800 text-slate-300 text-xs px-2 py-1 border border-slate-600"
              />
            </div>
          </>
        )}

        {selectedElementId && (
          <button
            onClick={onDeleteSelected}
            className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-all"
          >
            Delete Selected
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
       
        <button
          onClick={onSave}
          className="p-2 bg-slate-800/50 text-slate-400 rounded-lg hover:bg-slate-700/50 transition-all"
          title="Save"
        >
          <Save size={18} />
        </button>
        <button
          onClick={onExport}
          className="p-2 bg-slate-800/50 text-slate-400 rounded-lg hover:bg-slate-700/50 transition-all"
          title="Export Snapshot"
        >
          <Download size={18} />
        </button>
        <button
          onClick={onClear}
          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
          title="Clear Canvas"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
