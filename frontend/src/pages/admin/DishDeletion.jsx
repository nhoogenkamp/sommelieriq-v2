import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { deleteDish } from "../../api/dishApi";
import AdminWineTable from "../../components/admin/AdminWineTable";
import AdminWineFilters from "../../components/admin/AdminWineFilters";
// Importing with curly braces and without if export default: https://react.dev/learn/importing-and-exporting-components

// function to show react-dom information params: https://www.w3schools.com/React/showreact.asp?filename=demo_react_router_params
function DishDeletion() {
  const { restaurantId } = useParams();

  //https://react.dev/reference/react/useState
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
 
  //fetches the wines: https://react.dev/learn/synchronizing-with-effects#:~:text=its%20initial%20state.-,Fetching%20data,-If%20your%20Effect

  useEffect(() => {
    async function loadDishes() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getDishes();

        setDishes(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadDishes();
  }, [restaurantId]);


  // Clears the message and updates one filter.
  function updateFilter(setFilter, value) {
    setMessage("");
    setFilter(value);
  }


// Deletion of a dish
function deleteSelectedDish(foodId) {
  const entry = {
    food_id: foodId,
  };

  setMessage("");
  setError("");

  deleteDish(entry)
    .then(function (json) {
      const updated = dishes.filter(
        (dish) => dish.food_id !== foodId
      );

      setDishes(updated);
      setMessage(json.message);
    })
    .catch(function (error) {
      setError(error.message);
    });
}

  if (isLoading) {
    return (
      <main>
        <h1>Food Menu</h1>
        <p>Loading Food Menu...</p>
      </main>
    );
  }

    // if there is an error it will print the message from dishApi.js 
  if (error) {
    return (
      <main>
        <h1>Food Menu</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main>
        <h1>Delete a Dish</h1>
        <AdminWineFilters
            // complete wine array into WineFilters with wines={wines}
            wines={wines}
            wineId={wineId}
            selectedColour={selectedColour}
            selectedBottle={selectedBottle}
            maxPrice={maxPrice}
            selectedGrape={selectedGrape}
            selectedCountry={selectedCountry}
            selectedRegion={selectedRegion}
            setWineId={setWineId}
            setSelectedColour={setSelectedColour}
            setSelectedBottle={setSelectedBottle}
            setMaxPrice={setMaxPrice}
            setSelectedGrape={setSelectedGrape}
            setSelectedCountry={setSelectedCountry}
            setSelectedRegion={setSelectedRegion}
            clearFilters={clearFilters}
            updateFilter={updateFilter}
        />
        {message && <p>{message}</p>}
    
        {/* Conditionally render either a message or the wine table with the use of Conditional operator (? :) 
            https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator */}
        
        {filteredWines.length === 0 ? (
            <p>No wines are currently available or no wines match the selected filters..</p>
        ) : (
        <div className="price-table-container">
        <AdminWineTable
            wines={filteredWines}
            deleteSelectedWine={deleteSelectedWine}
        />
        </div>
    )}
  </main>
);
}

export default WineDeletion;