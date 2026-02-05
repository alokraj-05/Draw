import { useReactFlow, getViewportForBounds } from "@xyflow/react";
import { toPng} from "html-to-image";
import { Button } from "@/appcomponents/ui/button";
import { jsPDF } from "jspdf";
import "svg2pdf.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/appcomponents/ui/dropdown-menu";
import { toast } from "sonner";
function downloadImage(dataUrl: string) {
  const a = document.createElement("a");
  a.setAttribute("download", "drawFile.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

async function downloadPdf(dataUrl: string, width: number, height: number) {
  const pdf = new jsPDF({
    orientation: width > height ? "landscape" : "portrait",
    unit: "px",
    format: [width, height],
    compress: true,
  });
  toast.info("almost there...");
  pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
  pdf.save("drawFlow.pdf");
  toast.success("Downloaded!");
}
function DownloadButton() {
  const { getNodes, getNodesBounds } = useReactFlow();

  const exportFlow = async (type: "png" | "pdf") => {
    const nodes = getNodes();
    if (!nodes.length) return;

    const padding = 5;
    const nodesBounds = getNodesBounds(nodes);

    const width = (nodesBounds.width > 7000 ? nodesBounds.width - 800 : nodesBounds.width) + padding ;
    const height = (nodesBounds.height < 5500 ? nodesBounds.height - 400: nodesBounds.height) + padding;

    const viewport = getViewportForBounds(
      nodesBounds,
      width,
      height,
      0.5,
      2,
      padding,
    );

    const htmlElement = document.querySelector(
      ".react-flow__viewport",
    ) as HTMLElement;

    if (!htmlElement) return;

    const dataUrl = await toPng(htmlElement, {
      backgroundColor: "#0e0e0e",
      width,
      height,
      style: {
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
      },
      fontEmbedCSS: "",
      pixelRatio: 5,
    });
    if (type === "png") {
      downloadImage(dataUrl);
    } else {
      toast.info("Converting...");
      downloadPdf(dataUrl, width, height);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="font-semibold">
          Export
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuGroup className="p-regular">
          <DropdownMenuLabel className="text-xs py-0 px-0 m-none pl-1 font-semibold syne-semibold">
            Type
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => exportFlow("png")}>
            PNG
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportFlow("pdf")}>
            PDF
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DownloadButton;
