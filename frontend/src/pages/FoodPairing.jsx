import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRestaurantFood, getRestaurantSauces, sendDishes} from "../api/foodPairingApi";
import DishSelector from "../components/foodPairing/DishSelector";
import RecommendationTable from "../components/foodPairing/RecommendationTable";
import WineFilters from "../components/wines/WineFilters";

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
  // front end errors such as submit nothing.
  const [validationError, setValidationError] = useState("");

  // recommendations coming from flask
  const [recommendations, setRecommendations] = useState([]);
  const [combinedRecommendations, setCombinedRecommendations] = useState([]);

  // Stores the selected wine filters.
  const [selectedColour, setSelectedColour] = useState("");
  const [selectedBottle, setSelectedBottle] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedGrape, setSelectedGrape] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

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
  // Updates the number of dishes to pair.
  function updateDishCount(value) {
    setDishCount(Number(value));

    // Clears the previous dish and sauce selections.
    setSelectedDishes([]);
    setSelectedSauces([]);

    // Clears previous validation messages and recommendations.
    setValidationError("");
    setRecommendations([]);
    setCombinedRecommendations([]);
  }

  function updateDish(index, value) {
    const updated = [...selectedDishes];

    updated[index] = Number(value);

    setSelectedDishes(updated);

    // Clears the sauce when the dish changes.
    const updatedSauce = [...selectedSauces];
    updatedSauce[index] = "";
    setSelectedSauces(updatedSauce);

    setValidationError("");
  }

  // Updates the selected sauce for one dish.
  function updateSauce(index, value) {
  const updated = [...selectedSauces];

  updated[index] = Number(value);

  setSelectedSauces(updated);
  setValidationError("");
}

// Clears all selected wine filters.
function clearFilters() {
  setSelectedColour("");
  setSelectedBottle("");
  setMaxPrice("");
  setSelectedGrape("");
  setSelectedCountry("");
  setSelectedRegion("");
}

// Returns only wines that match the selected filters.
function filterWines(wines) {
  return wines.filter((wine) => {
    return (
      (selectedColour === "" || wine.wine_type === selectedColour) &&
      (selectedBottle === "" || wine.bottle_type === selectedBottle) &&
      (maxPrice === "" || Number(wine.price) <= Number(maxPrice)) &&
      (selectedGrape === "" || wine.grape === selectedGrape) &&
      (selectedCountry === "" || wine.country === selectedCountry) &&
      (selectedRegion === "" || wine.region === selectedRegion)
    );
  });
}

// Sends the selected dishes and sauces to Flask.
async function submitDishes() {
  // Creates the same dish structure used by the original JavaScript.
  const dishes = selectedDishes.map((foodId, index) => {
    const selectedFood = foods.find(
      (food) => Number(food.food_id) === Number(foodId)
    );

    const selectedSauce = sauces.find(
      (sauce) => Number(sauce.sauce_id) === Number(selectedSauces[index])
    );

    return {
      dish: selectedFood ? selectedFood.dish_name : "",
      sauce: selectedSauce ? selectedSauce.name : "",
    };
  });

  try {
    setValidationError("");

    const data = await sendDishes(restaurantId, dishes);

    setRecommendations(data.recommendations);
    setCombinedRecommendations(data.combined_recommendations);
  } catch (error) {
    setValidationError(error.message);
  }
}

// Combines all recommendation wines so WineFilters can create its options.
const recommendationWines = [
  ...combinedRecommendations,
  ...recommendations.flatMap((group) => group.recommendations),
];

  return (
    <section>
      <h1>Food Pairing</h1>
      <div className="dish-count-selector">
        <label htmlFor="dishCount"> How many dishes would you like to use for pairing?</label>

        <select
          id="dishCount"
          value={dishCount}
          // Saves the selected number in React state.
          // https://react.dev/reference/react-dom/components/select
          onChange={(event) => updateDishCount(event.target.value)}
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
      </div>

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
        {/* Submit button for sending dishes */}
        <button className="dish-submit-button" type="button" onClick={submitDishes}> Submit </button>
        
        {/* Showing error message from frontend such as submit nothing */}
        {validationError && <p>{validationError}</p>}

      {recommendationWines.length > 0 && (
        <WineFilters
          wines={recommendationWines}
          selectedColour={selectedColour}
          selectedBottle={selectedBottle}
          maxPrice={maxPrice}
          selectedGrape={selectedGrape}
          selectedCountry={selectedCountry}
          selectedRegion={selectedRegion}
          setSelectedColour={setSelectedColour}
          setSelectedBottle={setSelectedBottle}
          setMaxPrice={setMaxPrice}
          setSelectedGrape={setSelectedGrape}
          setSelectedCountry={setSelectedCountry}
          setSelectedRegion={setSelectedRegion}
          clearFilters={clearFilters}
        />
      )}

      {/* Shows combined recommendations when more than one dish was submitted. */}
      {combinedRecommendations.length > 0 && (
        <section>
          <h2>Combined Recommendations</h2>

          <RecommendationTable
            wines={filterWines(combinedRecommendations)}
            limit={25}
          />
        </section>
      )}

      {/* Shows recommendations for each individual dish. */}
      {recommendations.length > 0 && (
        <section>
          <h2>Individual Recommendations</h2>

          {recommendations.map((group, index) => (
            <div key={index}>
              <h3>{group.dish}</h3>

              {group.sauce && <p>{group.sauce}</p>}

              <RecommendationTable
                wines={filterWines(group.recommendations)}
                limit={15}
              />
            </div>
          ))}
        </section>
      )}

    </section>
  );
}

export default FoodPairing;