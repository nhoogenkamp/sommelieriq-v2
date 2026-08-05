function WineUploadTable({ wines }) {
  return (
    <table className="wine-table upload-wine-table">
      <thead>
        <tr>
          <th className="wine-name">Name</th>
          <th className="wine-type">Type</th>
          <th className="wine-grape">Grape</th>
          <th className="wine-country">Country</th>
          <th className="wine-region">Region</th>
          <th className="wine-year">Year</th>
          <th className="wine-bottle">Bottle</th>
          <th className="wine-price">Price</th>
          <th className="wine-available">Available</th>
          <th className="wine-description">Description</th>
          <th className="wine-body-score">Body</th>
          <th className="wine-tannin-score">Tannin</th>
          <th className="wine-acidity-score">Acidity</th>
          <th className="wine-sweetness-score">Sweetness</th>
        </tr>
      </thead>

      <tbody>
        {/* Creates one preview row for every wine in the CSV.
        https://react.dev/learn/rendering-lists */}
        {wines.map((wine, index) => (
          <tr key={index}>
            <td className="wine-name">{wine.name}</td>
            <td className="wine-type">{wine.wine_type}</td>
            <td className="wine-grape">{wine.grape}</td>
            <td className="wine-country">{wine.country}</td>
            <td className="wine-region">{wine.region}</td>
            <td className="wine-year">{wine.year}</td>
            <td className="wine-bottle">{wine.bottle_type}</td>
            <td className="wine-price">€{Number(wine.price).toFixed(2)}</td>
            <td className="wine-available">{Number(wine.available) === 1 ? "Yes" : "No"}</td>
            <td className="wine-description">{wine.description}</td>
            <td className="wine-body-score">{wine.body_score}</td>
            <td className="wine-tannin-score">{wine.tannin_score}</td>
            <td className="wine-acidity-score">{wine.acidity_score}</td>
            <td className="wine-sweetness-score">{wine.sweetness_score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default WineUploadTable;