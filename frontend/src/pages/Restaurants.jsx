import { Link } from "react-router-dom";

function Restaurants() {
  return (
    <main>
      <h1>SommelierIQ</h1>
      <p>Select a restaurant to view its wine list.</p>

      <ul>
        <li>
          <Link to="/restaurants/1/wines">Pembroke Street</Link>
        </li>

        <li>
          <Link to="/restaurants/2/wines">Crow Street</Link>
        </li>

        <li>
          <Link to="/restaurants/3/wines">The Bull & Castle</Link>
        </li>

        <li>
          <Link to="/restaurants/4/wines">Ryans Parkgate</Link>
        </li>

        <li>
          <Link to="/restaurants/5/wines">Monkstown</Link>
        </li>
      </ul>
    </main>
  );
}

export default Restaurants;