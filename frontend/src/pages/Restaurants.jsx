import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPublicRestaurants } from "../api/restaurants";

function Restaurants() {

  const [restaurants, setRestaurants] = useState([]);
  // Stores loading and error information.
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  //fetches the restaurants just like WineAvailability.jsx: https://react.dev/learn/synchronizing-with-effects#:~:text=its%20initial%20state.-,Fetching%20data,-If%20your%20Effect
  useEffect(() => {
    async function loadRestaurants() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getPublicRestaurants();

        setRestaurants(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  return (
    <main>
      <h1>SommelierIQ</h1>
      <p>Select a restaurant to view its wine list.</p>
      
      {isLoading && (
        <p>Loading restaurants...</p>
      )}

      {error && (
        <p>{error}</p>
      )}
      
      {!isLoading && !error && restaurants.length === 0 && (
        <p>No restaurants are currently available.</p>
      )}

      <div className="dashboard-grid">
        {restaurants.map((restaurant) => (
          <article
            key={restaurant.restaurant_id}
            className="dashboard-card">

            <h2>{restaurant.restaurant_name}</h2>

            {restaurant.outlet_name && (
              <h3>{restaurant.outlet_name}</h3>
            )}

            {restaurant.city && (
              <h4>{restaurant.city}</h4>
            )}

            <Link
              to={`/restaurants/${restaurant.restaurant_id}/${restaurant.slug}/wines`}
            >
              <h2>View Wine List</h2>
            </Link>

            <Link
              to={`/restaurants/${restaurant.restaurant_id}/${restaurant.slug}/food-pairing`}
            >
              <h2>Food Pairing</h2>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}

export default Restaurants;