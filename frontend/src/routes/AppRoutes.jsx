import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "../context/ProtectedRoute";

import Restaurants from "../pages/Restaurants";
import WineList from "../pages/WineList";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import FoodPairing from "../pages/FoodPairing";
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import WineAvailability from "../pages/admin/WineAvailability";
import WinePrice from "../pages/admin/WinePrice";
import WineDeletion from "../pages/admin/WineDeletion";
import WineUpload from "../pages/admin/WineUpload";
import MenuUpload from "../pages/admin/MenuUpload";
import DishDeletion from "../pages/admin/DishDeletion";
import DishUpdate from "../pages/admin/DishUpdate";
import ResetPassword from "../pages/admin/ResetPassword";
import AddUser from "../pages/admin/AddUser";
import ForgotPassword from "../pages/admin/ForgotPassword";

// how to use react router https://www.w3schools.com/React/showreact.asp?filename=demo_react_router_params
// protected route https://dev.to/olumidesamuel_/implementing-protected-routes-and-authentication-in-react-2026-edition-4k6e

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route 
              path="/restaurants" 
              element={<Restaurants />} 
          />

          <Route
              path="/restaurants/:restaurantId/:restaurant_slug/wines"
              element={<WineList />}
          />
          <Route
              path="/restaurants/:restaurantId/:restaurant_slug/food-pairing"
              element={<FoodPairing />}
          />
        </Route>

        <Route element={<AdminLayout />}>          
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />
          
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          {/* All admin roles can access these pages */}
          <Route element={<ProtectedRoute allowedRoles={["owner", "manager", "sommelier", "staff"]}/>}>        

            <Route
              path="/admin/restaurants/:restaurant_slug/dashboard"
              element={<Dashboard />}
            />        
            <Route
              path="/admin/restaurants/:restaurant_slug/wines/availability"
              element={<WineAvailability/>}
            />
          </Route>

          {/* All admin roles can access these pages */}
          <Route element={<ProtectedRoute allowedRoles={["owner", "manager", "sommelier"]}/>}>  

            <Route
              path="/admin/restaurants/:restaurant_slug/wines/price"
              element={<WinePrice />}
            />
            <Route
              path="/admin/restaurants/:restaurant_slug/wines/delete"
              element={<WineDeletion />}
            />

            <Route
              path="/admin/restaurants/:restaurant_slug/wines/upload"
              element={<WineUpload />}
            />
            <Route
              path="/admin/restaurants/:restaurant_slug/food/foodupload"
              element={<MenuUpload />}
            />

            <Route
              path="/admin/restaurants/:restaurant_slug/food/dishdeletion"
              element={<DishDeletion/>}
            />    

            <Route
              path="/admin/restaurants/:restaurant_slug/food/update"
              element={<DishUpdate />}
            />  
          </Route>      

          <Route element={<ProtectedRoute allowedRoles={["owner", "manager"]}/>}>

            <Route
              path="/admin/restaurants/:restaurant_slug/users/add"
              element={<AddUser />}
            />

          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;