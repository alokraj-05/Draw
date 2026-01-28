import React from "react"

const About: React.FC = () => {
  return (
    <div className="min-h-screen text-zinc-100 relative overflow-hidden">

      {/* Background gradients */}
      <div className="absolute right-[-20%] top-[10%] w-175 h-225 blur-[160px] opacity-60 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.45),transparent_70%)] pointer-events-none"/>
      <div className="absolute left-[10%] bottom-[10%] w-150 h-100 blur-[160px] opacity-40 bg-[radial-gradient(ellipse_at_30%_70%,rgba(168,85,247,0.45),transparent_75%)] pointer-events-none"/>
      <div className="absolute left-[20%] top-[60%] w-125 h-87.5 blur-[140px] opacity-30 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.35),transparent_80%)] pointer-events-none"/>

      <div className="relative z-10 mx-60 pt-24">

        {/* Heading */}
        <h1 className="text-7xl font-bold italiana-regular tracking-tight">
          About <span className="text-[#f6eed8]">Draw</span>
        </h1>

        <p className="text-zinc-400 max-w-3xl mt-6 p-regular text-justify">
          Draw is an open-source visual workspace built for thinkers, designers, and developers.
          It focuses on clarity and speed — offering multiple design spaces without unnecessary UI
          complexity.
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-10 mt-20">

          {/* Feature Card */}
          <div className="p-8 rounded-2xl bg-[linear-gradient(rgba(99,102,241,0.15),transparent_70%)] border border-white/5">
            <h3 className="text-2xl syne-semibold text-gray-200">Open Source</h3>
            <p className="text-zinc-400 mt-3 p-regular">
              Fully open source and community-driven. Extend it, customize it, and contribute freely.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[linear-gradient(rgba(168,85,247,0.15),transparent_70%)] border border-white/5">
            <h3 className="text-2xl syne-semibold text-gray-200">Design Spaces</h3>
            <p className="text-zinc-400 mt-3 p-regular">
              Multiple work modes including Flow diagrams, Free Canvas, and Database layouts — all in one tool.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[linear-gradient(rgba(236,72,153,0.15),transparent_70%)] border border-white/5">
            <h3 className="text-2xl syne-semibold text-gray-200">Multi Export</h3>
            <p className="text-zinc-400 mt-3 p-regular">
              Export your work in multiple formats for presentations, docs, or collaboration.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[linear-gradient(rgba(99,102,241,0.15),transparent_70%)] border border-white/5">
            <h3 className="text-2xl syne-semibold text-gray-200">Simple UI</h3>
            <p className="text-zinc-400 mt-3 p-regular">
              A minimal interface designed to keep focus on ideas, not menus and buttons.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[linear-gradient(rgba(168,85,247,0.15),transparent_70%)] border border-white/5">
            <h3 className="text-2xl syne-semibold text-gray-200">Unlimited Files</h3>
            <p className="text-zinc-400 mt-3 p-regular">
              Create unlimited projects and canvases without restrictions.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[linear-gradient(rgba(236,72,153,0.15),transparent_70%)] border border-white/5">
            <h3 className="text-2xl syne-semibold text-gray-200">100% Free</h3>
            <p className="text-zinc-400 mt-3 p-regular">
              No paywalls, no locked features — everything is available for free.
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}

export default About
