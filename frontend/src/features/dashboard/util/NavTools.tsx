import { ToggleGroup,ToggleGroupItem } from "@radix-ui/react-toggle-group" 
import {
  Pencil,
  Type,
  Slash,
  Square,
  Circle,
} from "lucide-react"

export type Tool =
  | "pencil"
  | "text"
  | "line"
  | "rectangle"
  | "circle"

interface NavToolsProps {
  value: Tool
  onChange: (tool: Tool) => void
}

const NavTools = ({ value, onChange }: NavToolsProps) => {
  return (
    <nav className="absolute top-5 right-[50%] flex items-center gap-2 rounded-xl border bg-accent p-2 shadow-sm">
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => v && onChange(v as Tool)}
        className="flex gap-5"
      >
        <ToggleGroupItem value="pencil" aria-label="Draw">
          <Pencil className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem value="text" aria-label="Text">
          <Type className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem value="line" aria-label="Line">
          <Slash className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem value="rectangle" aria-label="Rectangle">
          <Square className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem value="circle" aria-label="Circle">
          <Circle className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </nav>
  )
}

export default NavTools
