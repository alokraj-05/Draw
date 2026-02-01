import type { CanvasTool } from '../../dashboardSlice';

export type DrawStatusBarProps = {
  elementCount: number;
  selectedTool: CanvasTool;
  selectedElementId: string | null;
};

export function DrawStatusBar({
  elementCount,
  selectedTool,
  selectedElementId,
}: DrawStatusBarProps) {
  return (
    <div className="px-4 py-2 bg-[#1a1a1a] border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
      <div>
        Elements: {elementCount} | Tool: {selectedTool}
      </div>
      {selectedElementId && (
        <div className="text-blue-400">
          Selected · Delete/Backspace to remove · Drag to move · Handles to resize · Panel: stroke/fill/width
        </div>
      )}
      <div className="text-slate-500">Scroll to zoom · Space+drag or middle-drag to pan</div>
    </div>
  );
}
