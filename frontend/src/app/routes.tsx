import { createBrowserRouter} from "react-router-dom"
import App from "./App"
import Login from "../features/auth/login/Login"
import Home from "@/components/Home"
import { ProtectedRoute } from "./ProtectedRoute"
import Error from "@/components/Error"
import Dashboard from "@/features/dashboard/Dashboard"
import About from "@/pages/About"
import Privacy from "@/pages/Privacy"
const router = createBrowserRouter([
  {
    path: "/",
    element:<App/>,
    errorElement: <Error/>,
    children:[
      {
        index:true,
        element: <Home/>
      },
      {
        path: "about",
        element: <About/>
      }
    ]
  },
  
  {
    element: <ProtectedRoute/>,
    children:[
      {
        path: "dashboard",
        element: <Dashboard/>
      }
    ]
  },
  {
    path:"/login",
    element: <Login/>
  },
  {
    path:"/privacy",
    element: <Privacy/>
  }
])


export default router