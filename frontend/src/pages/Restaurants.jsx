import { Link } from "react-router-dom";

function Restaurants() {
  return (
    <main>
      <h1>SommelierIQ</h1>
      <p>Select a restaurant to view its wine list.</p>

      <ul>
        <li>
          <Link to="/restaurants/1/wines">Pembroke Street</Link>
          <br></br>
          <Link to="/restaurants/1/food-pairing">Food Paring</Link>
        </li>
          <br></br>
        <li>
          <Link to="/restaurants/2/wines">Crow Street</Link>
          <br></br>
          <Link to="/restaurants/2/food-pairing">Food Paring</Link>
        </li>
          <br></br>
        <li>
          <Link to="/restaurants/3/wines">The Bull & Castle</Link>
          <br></br>
          <Link to="/restaurants/3/food-pairing">Food Paring</Link>
        </li>
          <br></br>
        <li>
          <Link to="/restaurants/4/wines">Ryans Parkgate</Link>
          <br></br>
          <Link to="/restaurants/4/food-pairing">Food Paring</Link>
        </li>
          <br></br>
        <li>
          <Link to="/restaurants/5/wines">Monkstown</Link>
          <br></br>
          <Link to="/restaurants/5/food-pairing">Food Paring</Link>
        </li>
      </ul>
    </main>
  );
}

export default Restaurants;