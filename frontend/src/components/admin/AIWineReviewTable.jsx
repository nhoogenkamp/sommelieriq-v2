function AIWineReviewTable({ wines, updateSelectedWine }) {
// Same style as AdminDishTable.jsx 
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

          {/* Only show this column when updateSelectedWine is on the page.
          https://react.dev/learn/conditional-rendering */}
          {updateSelectedWine && (
            <>
              <th className="wine-update">Update</th>
            </>
          )}
        </tr>
      </thead>

      <tbody>
        {/* Mapping each wine object to a table row.
        https://react.dev/learn/rendering-lists */}
        {wines.map((wine, index) => (
          <tr key={index}>

            <td className="wine-name">
              {wine.name}
            </td>

            <td className="wine-type">
              {wine.wine_type}
            </td>

            <td className="wine-grape">
              {wine.grape}
            </td>

            <td className="wine-country">
              {wine.country}
            </td>

            <td className="wine-region">
              {wine.region}
            </td>

            <td className="wine-year">
              {wine.year}
            </td>

            <td className="wine-bottle">
              {wine.bottle_type}
            </td>

            <td className="wine-price">
              €{Number(wine.price).toFixed(2)}
            </td>

            <td className="wine-available">
              {Number(wine.available) === 1 ? "Yes" : "No"}
            </td>

            <td className="wine-description">
              {updateSelectedWine ? (
                <textarea
                  id={`wine-description-${index}`}
                  defaultValue={wine.description}
                />
              ) : (
                wine.description
              )}
            </td>

            <td className="wine-body-score">
              {updateSelectedWine ? (
                <input
                  type="number"
                  min="0"
                  max="20"
                  id={`wine-body-${index}`}
                  defaultValue={wine.body_score}
                />
              ) : (
                wine.body_score
              )}
            </td>

            <td className="wine-tannin-score">
              {updateSelectedWine ? (
                <input
                  type="number"
                  min="0"
                  max="20"
                  id={`wine-tannin-${index}`}
                  defaultValue={wine.tannin_score}
                />
              ) : (
                wine.tannin_score
              )}
            </td>

            <td className="wine-acidity-score">
              {updateSelectedWine ? (
                <input
                  type="number"
                  min="0"
                  max="20"
                  id={`wine-acidity-${index}`}
                  defaultValue={wine.acidity_score}
                />
              ) : (
                wine.acidity_score
              )}
            </td>

            <td className="wine-sweetness-score">
              {updateSelectedWine ? (
                <input
                  type="number"
                  min="0"
                  max="20"
                  id={`wine-sweetness-${index}`}
                  defaultValue={wine.sweetness_score}
                />
              ) : (
                wine.sweetness_score
              )}
            </td>

            {updateSelectedWine && (
              <>
                <td>
                  <button
                    className="wine-update-button"
                    type="button"
                    onClick={() =>
                      updateSelectedWine({
                        index: index,
                        name: wine.name,
                        wine_type: wine.wine_type,
                        grape: wine.grape,
                        country: wine.country,
                        region: wine.region,
                        year: wine.year,
                        bottle_type: wine.bottle_type,
                        price: wine.price,
                        available: wine.available,
                        description: document.getElementById(`wine-description-${index}`).value,
                        body_score: document.getElementById(`wine-body-${index}`).value,
                        tannin_score: document.getElementById(`wine-tannin-${index}`).value,
                        acidity_score: document.getElementById(`wine-acidity-${index}`).value,
                        sweetness_score: document.getElementById(`wine-sweetness-${index}`).value,
                      })
                    }
                  >
                    Update
                  </button>
                </td>
              </>
            )}

          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AIWineReviewTable;