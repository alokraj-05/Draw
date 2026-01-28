import { logout } from "@/features/auth/authThunks";
import { useAppDispatch} from "@/hooks/hooks";
import { useNavigate } from "react-router-dom";
const LogoutButton = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const handleCLick =async () =>{
    await dispatch(logout()).unwrap()
    navigate("/login",{replace: true})
  }

  return (
    <button onClick={()=>handleCLick()} className="px-3 py-1 rounded-md bg-[#f6eed8] text-gray-800 font-semibold cursor-pointer">Logout</button>
  )
}

export default LogoutButton