import { Link, useNavigate } from "react-router-dom";

function Restaurants() {
  const navigate = useNavigate();

  const restaurants = [
    {
      id: 1,
      slug: "fx-buckley-pembroke-street",
      name: "Pembroke Street",
    },
    {
      id: 2,
      slug: "fx-buckley-crow-street",
      name: "Crow Street",
    },
    {
      id: 3,
      slug: "fx-buckley-the-bull-and-castle",
      name: "The Bull & Castle",
    },
    {
      id: 4,
      slug: "fx-buckley-ryans-parkgate",
      name: "Ryans Parkgate",
    },
    {
      id: 5,
      slug: "fx-buckley-monkstown",
      name: "Monkstown",
    },
  ];

  return (
    <main>
      <h1>SommelierIQ</h1>
      <p>Select a restaurant to view its wine list.</p>

      <div className="dashboard-grid">
        {restaurants.map((restaurant) => (
          <article
            key={restaurant.id}
            className="dashboard-card">
  
            <Link
              to={`/restaurants/${restaurant.id}/${restaurant.slug}/wines`}
            >
              <h2>{restaurant.name}</h2>
            </Link>

            <Link
              to={`/restaurants/${restaurant.id}/${restaurant.slug}/food-pairing`}
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