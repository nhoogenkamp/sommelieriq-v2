import { Link } from "react-router-dom";

function Restaurants() {
  return (
    <main>
      <h1>SommelierIQ</h1>
      <p>Select a restaurant to view its wine list.</p>


      <div className="dashboard-grid">

        <article className="dashboard-card"
          onClick={() =>
            navigate(
              `/restaurants/1/wines`
            )
          }
        >
          <Link to="/restaurants/1/wines"><h2>Pembroke Street</h2></Link>
          <Link to="/restaurants/1/food-pairing"><h2>Food Paring</h2></Link>
        </article>

        <article className="dashboard-card"
          onClick={() =>
            navigate(
              `/restaurants/2/wines`
            )
          }
        >
          <Link to="/restaurants/2/wines"><h2>Crow Street</h2></Link>
          <Link to="/restaurants/2/food-pairing"><h2>Food Paring</h2></Link>
        </article>

        <article className="dashboard-card"
          onClick={() =>
            navigate(
              `/restaurants/3/wines`
            )
          }
        >
          <Link to="/restaurants/3/wines"><h2>The Bull & Castle</h2></Link>
          <Link to="/restaurants/3/food-pairing"><h2>Food Paring</h2></Link>
        </article>

        <article className="dashboard-card"
          onClick={() =>
            navigate(
              `/restaurants/4/wines`
            )
          }
        >
          <Link to="/restaurants/4/wines"><h2>Ryans Parkgate</h2></Link>
          <Link to="/restaurants/4/food-pairing"><h2>Food Paring</h2></Link>
        </article>

        <article className="dashboard-card"
          onClick={() =>
            navigate(
              `/restaurants/5/wines`
            )
          }
        >
          <Link to="/restaurants/5/wines"><h2>Monkstown</h2></Link>
          <Link to="/restaurants/5/food-pairing"><h2>Food Paring</h2></Link>
        </article>

      </div>
    </main>
  );
}

export default Restaurants;