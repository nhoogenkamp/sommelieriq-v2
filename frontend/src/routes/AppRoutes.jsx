import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Restaurants from "../pages/Restaurants";
import WineList from "../pages/WineList";

// how to use react router https://www.w3schools.com/React/showreact.asp?filename=demo_react_router_params

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
            path="/restaurants" 
            element={<Restaurants />} 
        />

        <Route
            path="/restaurants/:restaurantId/wines"
            element={<WineList />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;