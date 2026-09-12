import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPublicRestaurants } from "../api/restaurants";
import images from "../assets/images/images.js";

function Restaurants() {

  const [restaurants, setRestaurants] = useState([]);

  // Stores loading and error information.
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetches the restaurants from the public restaurant API.
  // https://react.dev/learn/synchronizing-with-effects
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


  // Groups restaurant outlets by restaurant name.
  // Each restaurant name becomes its own section on the page.
  const groupedRestaurants = restaurants.reduce(
    (groups, restaurant) => {

      const restaurantName = restaurant.restaurant_name;

      if (!groups[restaurantName]) {
        groups[restaurantName] = [];
      }

      groups[restaurantName].push(restaurant);

      return groups;

    },
    {}
  );


  return (
    <main className="restaurants-page">


      {/* HERO */}
      <section className="restaurants-hero">

        <div className="restaurants-hero-text">

          <p className="restaurants-eyebrow">
            CHOOSE WHERE YOU'RE DINING
          </p>

          <h1>
            Select your restaurant.
            <br />
            Find your wine.
          </h1>

          <p className="restaurants-hero-description">
            Choose your restaurant below to explore its wine list
            or find the perfect wine for your meal.
          </p>

          <a
            href="#restaurant-selection"
            className="restaurants-hero-button"
          >
            Choose Your Restaurant ↓
          </a>

        </div>


        <div className="restaurants-hero-visual">

          <img
            src={images.sommelierCellar}
            alt="Sommelier selecting wine from a restaurant collection"
          />

        </div>

      </section>



      {/* RESTAURANT CONTENT */}
      <div id="restaurant-selection">


        {/* LOADING */}
        {isLoading && (

          <section className="restaurants-status">

            <p>
              Loading restaurants...
            </p>

          </section>

        )}



        {/* ERROR */}
        {error && (

          <section className="restaurants-status">

            <p>
              {error}
            </p>

          </section>

        )}



        {/* EMPTY RESTAURANT STATE */}
        {!isLoading &&
          !error &&
          restaurants.length === 0 && (

            <section className="restaurants-status">

              <p>
                No restaurants are currently available.
              </p>

            </section>

          )}



        {/* RESTAURANT GROUPS */}
        {!isLoading &&
          !error &&
          restaurants.length > 0 && (

            <section className="restaurants-list">

              {Object.entries(groupedRestaurants).map(
                ([restaurantName, locations], groupIndex) => (

                  <section
                    key={restaurantName}
                    className={`restaurants-group ${
                      groupIndex % 2 === 0
                        ? "restaurants-group-light"
                        : "restaurants-group-cream"
                    }`}
                  >


                    {/* RESTAURANT GROUP HEADING */}
                    <div className="restaurants-group-heading">

                      <div>

                        <h2>
                          {restaurantName}
                        </h2>

                        <span className="restaurants-group-instruction">
                          Choose the location where you're dining.
                        </span>

                      </div>


                      <p>
                        {locations.length}{" "}
                        {locations.length === 1
                          ? "LOCATION"
                          : "LOCATIONS"}
                      </p>

                    </div>



                    {/* LOCATION GRID */}
                    <div className="restaurant-location-grid">

                      {locations.map((restaurant, index) => (

                        <article
                          key={restaurant.restaurant_id}
                          className="restaurant-location-card"
                        >


                          {/* LOCATION NUMBER */}
                          <span className="restaurant-location-number">

                            {String(index + 1).padStart(2, "0")}

                          </span>



                          {/* LOCATION INFORMATION */}
                          <div className="restaurant-location-content">


                            {restaurant.outlet_name && (

                              <h3>
                                {restaurant.outlet_name}
                              </h3>

                            )}


                            {restaurant.city && (

                              <p className="restaurant-location-city">
                                {restaurant.city}
                              </p>

                            )}


                            <p className="restaurant-location-description">
                              Dining here? Explore this location's wine
                              collection or find a wine that complements
                              your meal.
                            </p>



                            {/* PRIMARY ACTION */}
                            <Link
                              to={`/restaurants/${restaurant.restaurant_id}/${restaurant.slug}/wines`}
                              className="restaurant-wine-button"
                            >
                              Explore Wine List
                            </Link>



                            {/* SECONDARY ACTION */}
                            <Link
                              to={`/restaurants/${restaurant.restaurant_id}/${restaurant.slug}/food-pairing`}
                              className="restaurant-pairing-link"
                            >
                              Find a Wine Pairing
                              <span> →</span>
                            </Link>

                          </div>

                        </article>

                      ))}

                    </div>

                  </section>

                )
              )}

            </section>

          )}

      </div>

    </main>
  );
}

export default Restaurants;