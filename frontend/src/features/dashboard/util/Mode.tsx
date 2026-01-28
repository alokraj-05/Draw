import { Select, SelectContent, SelectItem, SelectTrigger, SelectGroup, SelectValue } from "@/appcomponents/ui/select";

type ModeProps = {
  className?: string;
  initialMode?: 'database' | 'canvas' | 'flow';
  onModeChange?: (mode: 'database' | 'canvas' | 'flow') => void;
}

const Mode = ({ className, initialMode = 'flow', onModeChange }: ModeProps) => {
  const handleModeChange = (value: string) => {
    const mode = value as 'database' | 'canvas' | 'flow';
    onModeChange?.(mode);
  };

  return (
    <div className={className}>
      <Select value={initialMode} onValueChange={handleModeChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="database">Database</SelectItem>
            <SelectItem value="canvas">Canvas</SelectItem>
            <SelectItem value="flow">Flow</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default Mode;