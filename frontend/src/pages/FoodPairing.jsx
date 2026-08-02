import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRestaurantFood, getRestaurantSauces,} from "../api/foodPairingApi";

function FoodPairing() {
  //same as winelist.jsx: function to show react-dom information params: https://www.w3schools.com/React/showreact.asp?filename=demo_react_router_params
  const { restaurantId } = useParams();

  // Stores how many dishes the customer wants to pair.
  // https://react.dev/reference/react/useState
  const [dishCount, setDishCount] = useState(0);

  // Stores the food items returned by Flask.
  const [foods, setFoods] = useState([]);

  // Stores the sauces returned by Flask.
  const [sauces, setSauces] = useState([]);

  // Shows a loading message while data is being requested.
  const [isLoading, setIsLoading] = useState(true);

  // Stores an error message if the request fails.
  const [error, setError] = useState("");

  // Loads food items and sauces for the restaurant.
  // https://react.dev/reference/react/useEffect
  useEffect(() => {
    async function loadFoodPairingData() {
      try {
        setIsLoading(true);
        setError("");

        const foodData =
          await getRestaurantFood(restaurantId);

        const sauceData =
          await getRestaurantSauces(restaurantId);

        setFoods(foodData);
        setSauces(sauceData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadFoodPairingData();
  }, [restaurantId]);

  if (isLoading) {
    return (
      <main>
        <h1>Food Pairing</h1>
        <p>Loading food menu...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Food Pairing</h1>
        <p>{error}</p>
      </main>
    );
  }


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

            {/* Temporary checks to confirm the API data loaded. */}
      <p>Food items loaded: {foods.length}</p>
      <p>Sauces loaded: {sauces.length}</p>

    </section>
  );
}

export default FoodPairing;