import React, {
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
// import FeatureImage from "/featureImg.png"
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
const ReactFlow = React.lazy(() =>
  import("@xyflow/react").then((mod) => ({ default: mod.ReactFlow })),
);

import DatabaseSchemaDemo from "./DatabaseSchema";
import "@xyflow/react/dist/style.css";
import { Spinner } from "@/appcomponents/ui/spinner";

const baseNodeStyle = {
  borderRadius: "14px",
  padding: "10px 14px",
  // border: "1px solid rgba(255,255,255,0.08)",
  fontWeight: 500,
  boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
  backdropFilter: "blur(8px)",
};

const initialNodes = [
  {
    id: "n1",
    position: { x: 1000, y: 300 },
    data: { label: "Mind map" },
    style: {
      ...baseNodeStyle,
      background: "linear-gradient(135deg,#6366f1,#4f46e5)",
      color: "white",
      width: 100,
    },
  },
  {
    id: "n2",
    position: { x: 1200, y: 300 },
    data: { label: "Work flows" },
    style: {
      ...baseNodeStyle,
      background: "linear-gradient(135deg,#22c55e,#16a34a)",
      color: "white",
      width: 160,
    },
  },
  {
    id: "n3",
    position: { x: 1400, y: 300 },
    data: { label: "Tree" },
    style: {
      ...baseNodeStyle,
      background: "linear-gradient(135deg,#f59e0b,#d97706)",
      color: "white",
      width: 140,
    },
  },
  {
    id: "n5",
    position: { x: 800, y: 200 },
    data: { label: "Algorithms" },
    style: {
      ...baseNodeStyle,
      background: "linear-gradient(135deg,#8f00ff,#8a00a0)",
      color: "white",
      width: 140,
    },
  },
  {
    id: "n4",
    position: { x: 1200, y: 0 },
    data: { label: "Your ideas" },
    style: {
      ...baseNodeStyle,
      width: 170,
      height: 170,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "16px",
      background:
        "linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))",
      border: "1px solid rgba(255,255,255,0.15)",
    },
  },
];

const initialEdges = [
  { id: "n4-n1", source: "n4", target: "n1" },
  { id: "n4-n2", source: "n4", target: "n2" },
  { id: "n4-n3", source: "n4", target: "n3" },
  { id: "n4-n5", source: "n4", target: "n5" },
];
const nodeTypes = {
  databaseSchema: DatabaseSchemaDemo,
};

const defaultNodes = [
  {
    id: "1",
    position: { x: 150, y: 100 },
    type: "databaseSchema",
    data: {
      label: "Products",
      schema: [
        { title: "id", type: "uuid" },
        { title: "name", type: "varchar" },
        { title: "description", type: "varchar" },
        { title: "warehouse_id", type: "uuid" },
        { title: "supplier_id", type: "uuid" },
        { title: "price", type: "money" },
        { title: "quantity", type: "int4" },
      ],
    },
  },
  {
    id: "2",
    position: { x: 450, y: 50 },
    type: "databaseSchema",
    data: {
      label: "Warehouses",
      schema: [
        { title: "id", type: "uuid" },
        { title: "name", type: "varchar" },
        { title: "address", type: "varchar" },
        { title: "capacity", type: "int4" },
      ],
    },
  },
  {
    id: "3",
    position: { x: 450, y: 300 },
    type: "databaseSchema",
    data: {
      label: "Suppliers",
      schema: [
        { title: "id", type: "uuid" },
        { title: "name", type: "varchar" },
        { title: "description", type: "varchar" },
        { title: "country", type: "varchar" },
      ],
    },
  },
];

const defaultEdges = [
  {
    id: "products-warehouses",
    source: "1",
    target: "2",
    sourceHandle: "warehouse_id",
    targetHandle: "id",
  },
  {
    id: "products-suppliers",
    source: "1",
    target: "3",
    sourceHandle: "supplier_id",
    targetHandle: "id",
  },
];
const Home: React.FC = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowCanvas(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);
  return (
    <div className="min-h-screen border-t-gray-400 text-zinc-100 flex justify-start relative overflow-hidden">
      {/* gradients inside */}
      <div
        className="
    absolute right-[-20%] top-[10%] w-175 h-225 blur-[160px] opacity-60 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.45),transparent_70%)] pointer-events-none"
      />
      <div className="absolute right-[10%] bottom-[15%] w-125 h-87.5 blur-[140px] opacity-50 bg-[radial-gradient(ellipse_at_30%_70%,rgba(168,85,247,0.45),transparent_75%)] pointer-events-none" />
      <div className="absolute left-[15%] bottom-[-20%] w-150 h-100 blur-[180px] opacity-30 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.35),transparent_80%)] pointer-events-none" />

      <div className="w-full z-10">
        {/* Logo / Title */}
        <Suspense fallback={<p>loading...</p>}>
          <div className="space-y-3 mx-60">
            <h1 className="text-8xl font-bold tracking-tight w-full mt-20 italiana-regular">
              Draw
            </h1>

            <span className="text-2xl font-normal pl-1.5 press-start">
              Open Source <mark className="bg-[#f6eed8] px-px py-1">Free</mark>{" "}
              draw application
            </span>

            <p className="text-zinc-400 max-w-3xl text-justify pl-1.5 mt-3 p-regular">
              DrawAI is a simple, open canvas for sketching ideas, diagrams, and
              visual explanations. It’s built for speed and clarity—no heavy UI,
              no distractions, just a space to think visually and iterate
              naturally.
            </p>
            <div className="mt-10 ml-1.5">
              <Link
                to={"/login"}
                className="syne-semibold px-3 py-1 font-semibold rounded-md bg-[linear-gradient(rgba(99,102,241,0.45),transparent_75%)] text-gray-800"
              >
                Get Started <FaAngleRight className="inline" />
              </Link>
            </div>
          </div>
        </Suspense>

        {/* UI Section */}
        <div className="mt-40 w-full relative overflow-hidden">
          <div className="rounded-2xl overflow-hidden relative h-175 flex justify-end">
            <div className="w-2/3 absolute z-10 top-0 left-0 px-60 backdrop-blur-xs">
              <h2 className="text-3xl syne-semibold text-gray-200">
                Free Canvas
              </h2>
              <p className="text-justify p-regular text-zinc-400 mt-4">
                An infinite, distraction-free canvas designed for quick
                sketches, diagrams, and idea mapping. Draw freely, connect
                concepts visually, and refine thoughts without switching tools
                or modes.
              </p>
            </div>
            <div className="w-full h-full rounded-2xl backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden" ref={ref}>
              {showCanvas && (
                <Suspense fallback={<Suspense/>}>
                  <ReactFlow
                    defaultNodes={initialNodes}
                    defaultEdges={initialEdges}
                    panOnScroll={false}
                    zoomOnScroll={false}
                    zoomOnPinch={false}
                    zoomOnDoubleClick={false}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    proOptions={{ hideAttribution: true }}
                    defaultEdgeOptions={{
                      style: { stroke: "#9ca3af", strokeWidth: 1.5 },
                      animated: true,
                    }}
                  />
                </Suspense>
              )}
            </div>
          </div>
        </div>

        <div className=" w-full relative overflow-hidden">
          <div className="rounded-2xl overflow-hidden relative h-175 flex justify-end">
            <div className="w-2/3 absolute z-10 top-0 right-0 px-70">
              <h2 className="text-3xl syne-semibold text-gray-200">
                Design Databse
              </h2>
              <p className="text-justify p-regular text-zinc-400 mt-4">
                Confused how to create your database schema ?
              </p>
              <p className="text-justify p-regular text-zinc-400 mt-4">
                Start from right here, no complex ui | no complex logic | just
                drag and drop | connect schema {">"} and you are good to go.
              </p>
            </div>
            <div className="w-[90%] h-[90%] rounded-2xl backdrop-blur-xl overflow-hidden" ref={ref}>
              <Suspense fallback={<Spinner/>}>
              <ReactFlow
                defaultNodes={defaultNodes}
                defaultEdges={defaultEdges}
                nodeTypes={nodeTypes}
                proOptions={{ hideAttribution: true }}
                defaultEdgeOptions={{
                  style: { stroke: "#9ca3af", strokeWidth: 1.5 },
                  animated: true,
                }}
              />
              </Suspense>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
