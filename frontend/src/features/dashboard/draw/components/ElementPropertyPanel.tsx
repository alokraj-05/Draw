import type { Element, TextElement } from '../../dashboardSlice';
import { FONT_OPTIONS } from './DrawToolbar';

export type ElementPropertyPanelProps = {
  element: Element | null;
  onStrokeColorChange: (color: string) => void;
  onFillColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
  onTextChange?: (text: string) => void;
  onFontFamilyChange?: (font: string) => void;
  onFontSizeChange?: (size: number) => void;
  onTextColorChange?: (color: string) => void;
};

const hasFillColor = (el: Element): el is Element & { fillColor: string } =>
  'fillColor' in el;

const isTextElement = (el: Element): el is TextElement => el.type === 'text';

export function ElementPropertyPanel({
  element,
  onStrokeColorChange,
  onFillColorChange,
  onStrokeWidthChange,
  onTextChange,
  onFontFamilyChange,
  onFontSizeChange,
  onTextColorChange,
}: ElementPropertyPanelProps) {
  if (!element) return null;

  const fillColor = hasFillColor(element) ? element.fillColor : undefined;
  const textEl = isTextElement(element) ? element : null;

  return (
    <div className="absolute right-4 top-24 w-56 rounded-lg border border-slate-700 bg-slate-900/95 p-3 shadow-xl">
      <div className="mb-2 text-xs font-medium text-slate-400">Selected element</div>
      <div className="flex flex-col gap-3">
        {textEl && onTextChange && onFontFamilyChange && onFontSizeChange && onTextColorChange && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Text</label>
              <input
                type="text"
                value={textEl.text}
                onChange={(e) => onTextChange(e.target.value)}
                className="w-full rounded bg-slate-800 text-slate-200 text-sm px-2 py-1.5 border border-slate-600"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Font</label>
              <select
                value={textEl.fontFamily}
                onChange={(e) => onFontFamilyChange(e.target.value)}
                className="w-full rounded bg-slate-800 text-slate-300 text-xs px-2 py-1.5 border border-slate-600"
              >
                {FONT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 w-14">Size</label>
              <input
                type="number"
                min="8"
                max="120"
                value={textEl.fontSize}
                onChange={(e) => onFontSizeChange(Number(e.target.value) || 24)}
                className="w-16 rounded bg-slate-800 text-slate-300 text-xs px-2 py-1 border border-slate-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 w-14">Color</label>
              <input
                type="color"
                value={textEl.color}
                onChange={(e) => onTextColorChange(e.target.value)}
                className="h-8 w-full cursor-pointer rounded border-0"
              />
            </div>
          </>
        )}
        {!textEl && (
          <>
            <div className="flex items-center gap-2">
              <label className="w-14 text-xs text-slate-400">Stroke</label>
              <input
                type="color"
                value={element.strokeColor}
                onChange={(e) => onStrokeColorChange(e.target.value)}
                className="h-8 w-full cursor-pointer rounded border-0"
              />
            </div>
            {fillColor !== undefined && (
              <div className="flex items-center gap-2">
                <label className="w-14 text-xs text-slate-400">Fill</label>
                <input
                  type="color"
                  value={fillColor === 'transparent' ? '#000000' : fillColor}
                  onChange={(e) => onFillColorChange(e.target.value)}
                  className="h-8 w-full cursor-pointer rounded border-0"
                />
                <button
                  type="button"
                  onClick={() => onFillColorChange('transparent')}
                  className="rounded bg-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-600"
                >
                  None
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <label className="w-14 text-xs text-slate-400">Width</label>
              <input
                type="range"
                min="1"
                max="20"
                value={element.strokeWidth}
                onChange={(e) => onStrokeWidthChange(Number(e.target.value))}
                className="flex-1"
              />
              <span className="w-6 text-xs text-slate-400">{element.strokeWidth}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
