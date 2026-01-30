import { createBrowserRouter} from "react-router-dom"
import Login from "../features/auth/login/Login"
import Home from "@/components/Home"
import { ProtectedRoute } from "./ProtectedRoute"
import Error from "@/components/Error"
import Dashboard from "@/features/dashboard/Dashboard"
import About from "@/pages/About"
import Privacy from "@/pages/Privacy"
import PublicLayout from "./PublicLayout"
import PrivateLayout from "./PrivateLayout"
import App from "./App"
const router = createBrowserRouter([
  {

    element:<App/>,
    errorElement: <Error/>,
    children:[
      {
        element: <PublicLayout/>,
        children:[
          {
            index:true,
            element: <Home/>
          },
          {
            path: "about",
            element: <About/>
          },
          {
            path:"privacy",
            element: <Privacy/>
          }
        ]
      },
      {
        element: <ProtectedRoute/>,
        errorElement: <Error/>,
        children:[
          {
            element: <PrivateLayout/>,
            children:[
              {path:'dashboard', element: <Dashboard/>}
            ]
          }
        ]
      },
    ]
  },
  {
    path:"/login",
    element: <Login/>
  },
  
])


export default router