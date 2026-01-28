import { Link } from "react-router-dom"
import { useAppSelector } from "@/hooks/hooks"
import { Tooltip,TooltipTrigger,TooltipContent } from "@/appcomponents/ui/tooltip"
import LogoutButton from "./LogoutButton"
import Logo from "/logo.png"
const Header = () => {
  const { isAuthenticated, user} = useAppSelector((state) => state.auth)


  return (
    <div className="flex h-12 w-full fixed top-0 left-0 z-20">
      <ul className="flex justify-around w-full items-center text-[#f6eed8] text-sm mt-5">
        <div className="">
          <Link to={"/"} className=" rounded-md py-1 px-2"><img src={Logo} alt="logo" className="w-7 h-7"/></Link>
        </div>
        <div className="flex gap-8 font-semibold justify-center items-center backdrop-blur-lg rounded-lg border border-secondary px-3 py-1">
        
        <Link to={'/about'} className="hover:bg-[#f6eed8]/30 rounded-md py-1 px-2">About</Link>
        <Link to={'/dashboard'} className="hover:bg-[#f6eed8]/30 rounded-md py-1 px-2">Dashboard</Link>
        <Link to={'https://github.com/alokraj-05'} className="hover:bg-[#f6eed8]/30 rounded-md py-1 px-2">Github</Link>

        </div>
        <ul className="flex gap-5">
          {isAuthenticated ?
          <div className="flex gap-5 items-center justify-center">
            <Tooltip>
              <TooltipTrigger>
            <img src={user.picture} alt="user image" className="w-6 h-6 rounded-full" />

              </TooltipTrigger>
              <TooltipContent>
              <p className=" py-1">{user.name}</p>

              </TooltipContent>
            </Tooltip>
            <LogoutButton/>
          </div> : <div className="">
            <Link to={"/login"} className="px-3 py-1 font-semibold rounded-md bg-[#f6eed8] text-gray-800">Get Started</Link>
          </div>
          }
        </ul>
      </ul>
    </div>
  ) 
}

export default Header