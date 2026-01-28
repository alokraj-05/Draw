import React from "react"
import { Link } from "react-router-dom"

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-40 border-t border-white/5 text-zinc-400 overflow-hidden">

      {/* Background glow */}
      <div className="absolute right-[-10%] top-[-40%] w-150 h-150 blur-[160px] opacity-30 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.35),transparent_70%)] pointer-events-none"/>
      <div className="absolute left-[20%] bottom-[-60%] w-150 h-150 blur-[160px] opacity-25 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.35),transparent_75%)] pointer-events-none"/>

      <div className="relative z-10 mx-60 py-16 grid grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold italiana-regular text-zinc-100">
            Draw
          </h2>
          <p className="mt-3 text-sm leading-relaxed p-regular">
            Open source visual workspace for ideas, diagrams, and fast thinking.
          </p>
        </div>

        {/* Product */}
        <div>
          <h3 className="text-zinc-100 syne-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white transition">About</Link></li>
            <li><Link to="/features" className="hover:text-white transition">Features</Link></li>
            <li><Link to="/export" className="hover:text-white transition">Export</Link></li>
            <li><Link to="/opensource" className="hover:text-white transition">Open Source</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-zinc-100 syne-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            <li><Link to="/license" className="hover:text-white transition">License</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-zinc-100 syne-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="https://github.com/alokraj-05/draw/issues" className="hover:text-white transition">Issues</a></li>
            <li><a href="https://github.com/alokraj-05/draw" target="_blank" className="hover:text-white transition">GitHub</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 text-center py-6 text-xs text-zinc-500">
        © {new Date().getFullYear()} DrawAI. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
