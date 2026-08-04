import AdminWinePopup from "./AdminWinePopup.jsx";

function AdminWineTable({ wines, updateAvailability }) {
  return (
    <table className="wine-table admin-wine-table">
      <thead>
        <tr>
          <th className="wine_id">WineID</th>
          <th className="wine-available">Available</th>
          <th className="wine-name">Name</th>
          <th className="wine-type">Type</th>
          <th className="wine-grape">Grape</th>
          <th className="wine-country">Country</th>
          <th className="wine-region">Region</th>
          <th className="wine-year">Year</th>
          <th className="wine-bottle">Bottle</th>
          <th className="wine-price">Price</th>

          
          <th className="wine-view">View</th>
        </tr>
      </thead>

      <tbody>
        {/* Mapping each wine object to a table row.
        https://react.dev/learn/rendering-lists
        for dropdown changes: https://react.dev/reference/react-dom/components/select and https://www.w3schools.com/react/react_forms_select.asp 
        In the database value is either 1 or 0 not yes */}
        {wines.map((wine) => (
          <tr key={wine.wine_id}>
            <td className="wine_id">{wine.wine_id}</td>

            <td className="wine-available">
              <select value={wine.available}
               // Sends the wine ID and newly selected availability to the page.
                onChange={(event) =>
                  updateAvailability(wine.wine_id, Number(event.target.value))
                }
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </td>            <td className="wine-name">{wine.name}</td>
            <td className="wine-type">{wine.wine_type}</td>
            <td className="wine-grape">{wine.grape}</td>
            <td className="wine-country">{wine.country}</td>
            <td className="wine-region">{wine.region}</td>
            <td className="wine-year">{wine.year}</td>
            <td className="wine-bottle">{wine.bottle_type}</td>
            <td className="wine-price">€{Number(wine.price).toFixed(2)}</td>

            {/* Opens the popup for this wine */}
            <td className="wine-view"><AdminWinePopup wine={wine} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AdminWineTable;