import { useState } from "react";
import { useParams } from "react-router-dom";

function FoodPairing() {
  //same as winelist.jsx: function to show react-dom information params: https://www.w3schools.com/React/showreact.asp?filename=demo_react_router_params
  const { restaurantId } = useParams();

  // Stores how many dishes the customer wants to pair.
  // https://react.dev/reference/react/useState
  const [dishCount, setDishCount] = useState(0);

  return (
    <section>
      <h1>Food Pairing</h1>

      <label htmlFor="dishCount"> How many dishes would you like to use for pairing?</label>

      <select
        id="dishCount"
        value={dishCount}
        // Saves the selected number in React state.
        // https://react.dev/reference/react-dom/components/select
        onChange={(event) => setDishCount(Number(event.target.value))}
      >
        <option value="0">How many dishes</option>
        <option value="1">1 Dish</option>
        <option value="2">2 Dishes</option>
        <option value="3">3 Dishes</option>
        <option value="4">4 Dishes</option>
        <option value="5">5 Dishes</option>
        <option value="6">6 Dishes</option>
        <option value="7">7 Dishes</option>
        <option value="8">8 Dishes</option>
      </select>
    </section>
  );
}

export default FoodPairing;