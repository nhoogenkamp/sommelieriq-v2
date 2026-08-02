import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRestaurantFood, getRestaurantSauces,} from "../api/foodPairingApi";
import DishSelector from "../components/foodPairing/DishSelector";

function FoodPairing() {
  //same as winelist.jsx: function to show react-dom information params: https://www.w3schools.com/React/showreact.asp?filename=demo_react_router_params
  const { restaurantId } = useParams();

  // Stores how many dishes the customer wants to pair.
  // https://react.dev/reference/react/useState
  const [dishCount, setDishCount] = useState(0);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [selectedSauces, setSelectedSauces] = useState([]);

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

  function updateDish(index, value) {
    const updated = [...selectedDishes];

    updated[index] = Number(value);

    setSelectedDishes(updated);
  }

  // Updates the selected sauce for one dish.
  function updateSauce(index, value) {
  const updated = [...selectedSauces];

  updated[index] = Number(value);

  setSelectedSauces(updated);
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


      <div className="dish-selector-list">
        {/* Creates one DishSelector for each dish chosen above.
        Array.from() creates a temporary array with the same length as dishCount.
        The "_" value is not used, but index is needed to:
        1. give each DishSelector a unique key,
        2. display Dish 1, Dish 2, Dish 3...,
        3. store each selected dish in the correct position of selectedDishes.
        https://medium.com/@vishalthakur2463/mastering-array-from-in-javascript-with-real-life-examples-6af98a667b5b
        */}
        {Array.from({ length: dishCount }).map((_, index) => (
        <DishSelector
          key={index}
          dishNumber={index + 1}
          foods={foods}
          sauces={sauces}
          selectedDish={selectedDishes[index] || ""}
          selectedSauce={selectedSauces[index] || ""}
          setSelectedDish={(value) => updateDish(index, value)}
          setSelectedSauce={(value) => updateSauce(index, value)}
        />
        ))}
      </div>

    </section>
  );
}

export default FoodPairing;