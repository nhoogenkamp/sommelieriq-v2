import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllWines, deleteWine } from "../../api/wineApi";
import AdminWineTable from "../../components/admin/AdminWineTable";
import AdminWineFilters from "../../components/admin/AdminWineFilters";
// Importing with curly braces and without if export default: https://react.dev/learn/importing-and-exporting-components

// function to show react-dom information params: https://www.w3schools.com/React/showreact.asp?filename=demo_react_router_params
function WineDeletion() {
  const { restaurant_slug } = useParams();

  //https://react.dev/reference/react/useState
  const [wines, setWines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
 
  // Filters
  const [selectedColour, setSelectedColour] = useState("");
  const [selectedBottle, setSelectedBottle] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedGrape, setSelectedGrape] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [wineId, setWineId] = useState("");



  //fetches the wines: https://react.dev/learn/synchronizing-with-effects#:~:text=its%20initial%20state.-,Fetching%20data,-If%20your%20Effect

  useEffect(() => {
    async function loadWines() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getAllWines();

        setWines(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadWines();
  }, [restaurant_slug]);

  const filteredWines = wines.filter((wine) => {
    return (
      (wineId === "" || Number(wine.wine_id) === Number(wineId)) &&  

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
        Number(wine.price) <= Number(maxPrice)) &&
      
      // adding new filters same style as above: 
      (selectedGrape === "" || wine.grape === selectedGrape) &&
      (selectedCountry === "" || wine.country === selectedCountry) &&
      (selectedRegion === "" || wine.region === selectedRegion)
    );
  });

  // Clears the message and updates one filter.
  function updateFilter(setFilter, value) {
    setMessage("");
    setFilter(value);
  }

  // changes all filters back to their original empty values
  function clearFilters() {
    setWineId("");
    setSelectedColour("");
    setSelectedBottle("");
    setMaxPrice("");
    setSelectedGrape("");
    setSelectedCountry("");
    setSelectedRegion("");
    setMessage("");
  }

// Deletion of a wine
function deleteSelectedWine(wineId) {
  const entry = {
    wine_id: wineId,
  };

  setMessage("");
  setError("");

  deleteWine(entry)
    .then(function (json) {
      const updated = wines.filter(
        (wine) => wine.wine_id !== wineId
      );

      setWines(updated);
      setMessage(json.message);
    })
    .catch(function (error) {
      setError(error.message);
    });
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
        <h1>Delete a Wine</h1>
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