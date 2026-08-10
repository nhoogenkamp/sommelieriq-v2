import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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

// how to use react router https://www.w3schools.com/React/showreact.asp?filename=demo_react_router_params

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
              path="/restaurants/:restaurantId/wines"
              element={<WineList />}
          />
          <Route
              path="/restaurants/:restaurantId/food-pairing"
              element={<FoodPairing />}
          />
        </Route>

        
        <Route element={<AdminLayout />}>          
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/admin/restaurants/:restaurantId/dashboard"
            element={<Dashboard />}
          />        
          <Route
            path="/admin/restaurants/:restaurantId/wines/availability"
            element={<WineAvailability/>}
          />
          <Route
            path="/admin/restaurants/:restaurantId/wines/price"
            element={<WinePrice />}
          />
          <Route
            path="/admin/restaurants/:restaurantId/wines/delete"
            element={<WineDeletion />}
          />

          <Route
            path="/admin/restaurants/:restaurantId/wines/upload"
            element={<WineUpload />}
          />
          <Route
            path="/admin/restaurants/:restaurantId/food/foodupload"
            element={<MenuUpload />}
          />

          <Route
            path="/admin/restaurants/:restaurantId/food/dishdeletion"
            element={<DishDeletion/>}
          />          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;