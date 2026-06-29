import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetails from "./pages/ProductDetails";
import AppProduct from "./admin/AddProduct";
import EditProduct from "./admin/Editproduct";
import ProductList from "./admin/ProductList";

const router = createBrowserRouter([
  {path: "/", element: <Home/>},
  {path: "/login", element: <Login/>},
  {path: "/signup", element: <Signup/>},
  {path: "/product/:id", element: <ProductDetails/>},

  {path: "/admin/products", element: <ProductList/>},
  {path: "/admin/products/add", element: <AppProduct/>},
  {path: "/admin/products/edit/:id", element: <EditProduct/>},
]);

export default function App() {
  return <RouterProvider router={router}/>;
}