import AdminWinePopup from "./AdminWinePopup.jsx";

function AdminWineTable({ wines, updateAvailability, updatePrice, deleteSelectedWine, }) {
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

           {/* Only show this column when updatePrice is on the page https://react.dev/learn/conditional-rendering */}
          {updatePrice && (
            <>
              <th className="wine-new-price">New Price</th>
              <th className="wine-update">Update</th>
            </>
          )}

           {/* Only show this column when deletion is on the page https://react.dev/learn/conditional-rendering */}
          {deleteSelectedWine && (
            <>
              <th className="wine-delete-button">Delete Wine</th>
            </>
          )}
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

            {/* Shows a dropdown when updateAvailability exists.
            Otherwise displays Yes or No as text. https://react.dev/learn/conditional-rendering */}
            <td className="wine-available">
              {updateAvailability ? (
                <select
                  value={wine.available}
                  onChange={(event) =>
                    updateAvailability(wine.wine_id, Number(event.target.value))
                  }
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              ) : (
                wine.available === 1 ? "Yes" : "No"
              )}
            </td>        

            <td className="wine-name">{wine.name}</td>
            <td className="wine-type">{wine.wine_type}</td>
            <td className="wine-grape">{wine.grape}</td>
            <td className="wine-country">{wine.country}</td>
            <td className="wine-region">{wine.region}</td>
            <td className="wine-year">{wine.year}</td>
            <td className="wine-bottle">{wine.bottle_type}</td>
            <td className="wine-price">€{Number(wine.price).toFixed(2)}</td>

            {updatePrice && (<> 
            <td className="wine-new-price"><input type="number" min="0" step="0.01" id={`price-${wine.wine_id}`} /></td>

              <td><button className="wine-update-button"type="button"onClick={() =>
                    updatePrice(wine.wine_id, document.getElementById(`price-${wine.wine_id}`).value)                  }
                > Update</button></td>
            </>
          )}
            {deleteSelectedWine && (<> 
              <td><button className="wine-delete-button" onClick={() => {
                if (window.confirm("Delete this wine?")) {deleteSelectedWine(wine.wine_id);}
            }}
        >
            Delete
        </button></td>
            </>
          )}

            {/* Opens the popup for this wine */}
            <td className="wine-view"><AdminWinePopup wine={wine} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AdminWineTable;