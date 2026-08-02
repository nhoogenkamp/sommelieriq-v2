import WinePopup from "../wines/WinePopup";

function RecommendationTable({ wines, limit }) {
  return (
    <table className="wine-table">
      <thead>
        <tr>
          <th className="wine-name">Name</th>
          <th className="wine-type">Type</th>
          <th className="wine-grape">Grape</th>
          <th className="wine-country">Country</th>
          <th className="wine-region">Region</th>
          <th className="wine-year">Year</th>
          <th className="wine-bottle">Bottle</th>
          <th className="wine-match">Match</th>
          <th className="wine-price">Price</th>
          <th className="wine-view">View</th>
        </tr>
      </thead>

      <tbody>
        {/* Same style as winepage with changes as wine-match
        Limits the recommendations and creates one row for each wine.
        https://www.w3schools.com/Jsref/jsref_slice_array.asp
        */}
        {wines.slice(0, limit).map((wine) => (
          <tr key={wine.wine_id}>
            <td className="wine-name">{wine.name}</td>
            <td className="wine-type">{wine.wine_type}</td>
            <td className="wine-grape">{wine.grape}</td>
            <td className="wine-country">{wine.country}</td>
            <td className="wine-region">{wine.region}</td>
            <td className="wine-year">{wine.year}</td>
            <td className="wine-bottle">{wine.bottle_type}</td>
            <td className="wine-match">{wine.match_percentage}%</td>
            <td className="wine-price">€{Number(wine.price).toFixed(2)}</td>

            {/* Opens the popup for this wine */}
            <td className="wine-view"><WinePopup wine={wine} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RecommendationTable;