import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter} from 'react-router-dom'
import App from './App'
import AuthLayout from './components/AuthLayout'
import { LoginFormLight } from './components/LoginForm/LoginForm'
import { RegisterFormLight } from './components/RegisterForm/RegisterForm'
import Layout from './Layout'
import ProductsPage from './components/ProductPage/ProductPage'
import Home from './components/Home/Home'
import CartPage from './components/CartPage/CartPage'
import { Toaster } from './components/ui/sonner'
import AdminPage from './components/admin/adminPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <AuthLayout><App/></AuthLayout>,
        children: [
          {
            path: "/products",
            element: <ProductsPage/>
          },
          {
            path: "/",
            element: <Home/>
          },
          {
            path: "/cart",
            element: <CartPage/>
          },
          {
            path: "/admin",
            element: <AdminPage/>
          }
        ]
      },
      {
        path: "/auth/login",
        element: <LoginFormLight/>
      },
      {
        path: "/auth/register",
        element: <RegisterFormLight/>
      }
    ]
  }
]
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
    <Toaster />
  </StrictMode>,
)
