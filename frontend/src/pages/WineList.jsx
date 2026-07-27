import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRestaurantWines } from "../api/wineApi";
import WineTable from "../components/wines/WineTable";
import WineFilters from "../components/wines/WineFilters";
// Importing with curly braces and without if export default: https://react.dev/learn/importing-and-exporting-components

// function to show react-dom information params: https://www.w3schools.com/React/showreact.asp?filename=demo_react_router_params
function WineList() {
  const { restaurantId } = useParams();

  //https://react.dev/reference/react/useState
  const [wines, setWines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [selectedColour, setSelectedColour] = useState("");
  const [selectedBottle, setSelectedBottle] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  //fetches the wines: https://react.dev/learn/synchronizing-with-effects#:~:text=its%20initial%20state.-,Fetching%20data,-If%20your%20Effect

  useEffect(() => {
    async function loadWines() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getRestaurantWines(restaurantId);

        setWines(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadWines();
  }, [restaurantId]);

  const filteredWines = wines.filter((wine) => {
    return (
      // when selectedColour is empty, all colours are allowed
      // otherwise, the wine type must match the selected colour
      (selectedColour === "" ||
        wine.wine_type === selectedColour) &&

      // when selectedBottle is empty, all bottle types are allowed
      // otherwise, the bottle type must match
      (selectedBottle === "" ||
        wine.bottle_type === selectedBottle) &&

      // when maxPrice is empty, there is no price limit
      // otherwise, the wine price must be below or equal to it
      (maxPrice === "" ||
        Number(wine.price) <= Number(maxPrice))
    );
  });

  // changes all filters back to their original empty values
  function clearFilters() {
    setSelectedColour("");
    setSelectedBottle("");
    setMaxPrice("");
  }

  if (isLoading) {
    return (
      <main>
        <h1>Wine List</h1>
        <p>Loading wines...</p>
      </main>
    );
  }

    // if there is an error it will print the message from wineApi.js 
  if (error) {
    return (
      <main>
        <h1>Wine List</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Wine List</h1>
      <WineFilters
        selectedColour={selectedColour}
        selectedBottle={selectedBottle}
        maxPrice={maxPrice}
        setSelectedColour={setSelectedColour}
        setSelectedBottle={setSelectedBottle}
        setMaxPrice={setMaxPrice}
        clearFilters={clearFilters}
      />
      {/* Conditionally render either a message or the wine table with the use of Conditional operator (? :) 
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator */}
      
      {filteredWines.length === 0 ? (
        <p>No wines are currently available or no wines match the selected filters..</p>
      ) : (
      <WineTable wines={filteredWines} />
    )}
  </main>
);
}

export default WineList;