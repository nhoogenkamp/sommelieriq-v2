import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Restaurants from "../pages/Restaurants";
import WineList from "../pages/WineList";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import FoodPairing from "../pages/FoodPairing";
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import WineAvailability from "../pages/admin/WineAvailability";

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;