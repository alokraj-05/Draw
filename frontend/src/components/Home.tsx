import React from "react"
import FeatureImage from "/featureImg.png"
import { Link } from "react-router-dom"
import {FaAngleRight } from "react-icons/fa6"

const Home: React.FC = () => {

  return (
    <div className="min-h-screen border-t-gray-400 text-zinc-100 flex justify-start relative overflow-hidden">
  {/* gradients inside */}
        <div
  className="
    absolute right-[-20%] top-[10%] w-175 h-225 blur-[160px] opacity-60 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.45),transparent_70%)] pointer-events-none"/>
<div className="absolute right-[10%] bottom-[15%] w-125 h-87.5 blur-[140px] opacity-50 bg-[radial-gradient(ellipse_at_30%_70%,rgba(168,85,247,0.45),transparent_75%)] pointer-events-none"/>
<div className="absolute left-[15%] bottom-[-20%] w-150 h-100 blur-[180px] opacity-30 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.35),transparent_80%)] pointer-events-none"/>



      <div className="w-full z-10">
        
        {/* Logo / Title */}
        <div className="space-y-3 mx-60">
          <h1 className="text-8xl font-bold tracking-tight w-full mt-20 italiana-regular">
            Draw
          </h1>

          <span className="text-2xl font-normal pl-1.5 press-start">
            Open Source <mark className="bg-[#f6eed8] px-px py-1">Free</mark> draw application
          </span>

          <p className="text-zinc-400 max-w-3xl text-justify pl-1.5 mt-3 p-regular">
            DrawAI is a simple, open canvas for sketching ideas, diagrams, and visual explanations.
            It’s built for speed and clarity—no heavy UI, no distractions, just a space to think
            visually and iterate naturally.
          </p>
          <div className="mt-10 ml-1.5">
            <Link to={"/login"} className=" text-white syne-semibold px-3 py-1 font-semibold rounded-md bg-[linear-gradient(rgba(99,102,241,0.45),transparent_75%)] text-gray-800">Get Started <FaAngleRight className="inline"/></Link>
          </div>
        </div>

        {/* Image UI Section */}
        <div className="mt-40 w-full text-end relative overflow-hidden">

          <div className="p-10 rounded-2xl overflow-hidden relative h-175 flex justify-end mx-60">
            
            {/* Radial Gradient Glow */}
            

            <div className="text-end w-2/3 relative z-10">
              <h2 className="text-6xl syne-semibold text-gray-200">
                Free Canvas
              </h2>
              <p className="text-justify p-regular text-zinc-400 mt-4">
                An infinite, distraction-free canvas designed for quick sketches, diagrams,
                and idea mapping. Draw freely, connect concepts visually, and refine thoughts
                without switching tools or modes.
              </p>
            </div>

            <img
              src={FeatureImage}
              alt="Feature Image"
              className="absolute top-50 right-100 z-10 "
            />
          </div>

          {/* Feature Cards */}
          
        </div>

      </div>
    </div>
  )
}

export default Home
