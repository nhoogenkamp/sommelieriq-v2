import AdminWinePopup from "./AdminWinePopup.jsx";

function AdminWineTable({ wines }) {
  return (
    <table className="wine-table">
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
          <th className="wine-body_score">body score</th>
          <th className="wine-tannin_score">tannin score</th>
          <th className="wine-acidity_score">acidity score</th>
          <th className="wine-sweetness_score">sweetness score</th>
          
          <th className="wine-view">View</th>
        </tr>
      </thead>

      <tbody>
        {/* Mapping each wine object to a table row.
        https://react.dev/learn/rendering-lists */}
        {wines.map((wine) => (
          <tr key={wine.wine_id}>
            <td className="wine-wine_id">{wine.wine_id}</td>
            <td className="wine-available">{wine.available === 1 ? "Yes" : "No"}</td>
            <td className="wine-name">{wine.name}</td>
            <td className="wine-type">{wine.wine_type}</td>
            <td className="wine-grape">{wine.grape}</td>
            <td className="wine-country">{wine.country}</td>
            <td className="wine-region">{wine.region}</td>
            <td className="wine-year">{wine.year}</td>
            <td className="wine-bottle">{wine.bottle_type}</td>
            <td className="wine-price">€{Number(wine.price).toFixed(2)}</td>
            <td className="wine-body_score">{wine.body_score}</td>
            <td className="wine-tannin_score">{wine.tannin_score}</td>
            <td className="wine-acidity_score">{wine.acidity_score}</td>
            <td className="wine-sweetness_score">{wine.sweetness_score}</td>


            {/* Opens the popup for this wine */}
            <td className="wine-view"><AdminWinePopup wine={wine} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AdminWineTable;