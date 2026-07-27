import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRestaurantWines } from "../api/wineApi";
import WineTable from "../components/wines/WineTable";
// Importing with curly braces and without if export default: https://react.dev/learn/importing-and-exporting-components

// function to show react-dom information params: https://www.w3schools.com/React/showreact.asp?filename=demo_react_router_params
function WineList() {
  const { restaurantId } = useParams();

  //https://react.dev/reference/react/useState
  const [wines, setWines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
      {/* Conditionally render either a message or the wine table with the use of Conditional operator (? :) 
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator */}
      
      {wines.length === 0 ? (
        <p>No wines are currently available.</p>
      ) : (
      <WineTable wines={wines} />
    )}
  </main>
);
}

export default WineList;