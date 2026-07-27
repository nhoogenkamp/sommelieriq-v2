function WineTable({ wines }) {
  return (
    <table className="wine-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Grape</th>
          <th>Country</th>
          <th>Region</th>
          <th>Year</th>
          <th>Bottle</th>
          <th>Price</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        {/* Mapping each wine object to a table row.
        https://react.dev/learn/rendering-lists */}
        {wines.map((wine) => (
          <tr key={wine.wine_id}>
            <td>{wine.name}</td>
            <td>{wine.wine_type}</td>
            <td>{wine.grape}</td>
            <td>{wine.country}</td>
            <td>{wine.region}</td>
            <td>{wine.year}</td>
            <td>{wine.bottle_type}</td>
            <td>€{Number(wine.price).toFixed(2)}</td>
            <td>{wine.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default WineTable;